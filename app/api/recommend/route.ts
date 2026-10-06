import { z } from 'zod'
import { LAPTOPS, bestPrice, formatStorage } from '@/lib/laptops'
import {
  effectiveBudget,
  heuristicRecommendation,
  rankLaptops,
  requirementsSchema,
  type Recommendation,
} from '@/lib/recommend'

export const maxDuration = 30

const aiSchema = z.object({
  topPickId: z.string(),
  summary: z.string().describe('One sentence summary of why this is the best choice.'),
  reasons: z.array(z.string()).min(2).max(5).describe('Concise bullet reasons tied to the user requirements.'),
  rankedIds: z.array(z.string()).describe('Remaining candidate ids, best to worst.'),
})

type AIResponse = z.infer<typeof aiSchema>

async function callGroq(promptPayload: unknown, apiKey: string): Promise<AIResponse> {
  const models = ['llama-3.1-8b-instant', 'llama3-70b-8192', 'llama-3.3-70b-versatile']
  let lastError: Error | null = null

  for (const model of models) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content:
                'You are LapWise, an honest laptop buying advisor. Choose ONLY from the provided candidate IDs. Respect the budget strictly unless nothing fits. Reasons must be specific, cite concrete specs or prices, and be under 25 words each. Respond ONLY in valid JSON matching this schema: {"topPickId": string, "summary": string, "reasons": string[], "rankedIds": string[]}',
            },
            {
              role: 'user',
              content: JSON.stringify(promptPayload),
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Groq model ${model} error (${res.status}): ${errorText}`)
      }

      const json = await res.json()
      const content = json.choices?.[0]?.message?.content
      if (!content) throw new Error(`Groq model ${model} returned empty response`)
      return aiSchema.parse(JSON.parse(content))
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
    }
  }

  throw lastError || new Error('All Groq models failed')
}

async function callGemini(promptPayload: unknown, apiKey: string): Promise<AIResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: 'You are LapWise, an honest laptop buying advisor. Choose ONLY from the provided candidate IDs. Respect the budget strictly unless nothing fits. Reasons must be specific, cite concrete specs or prices, and be under 25 words each. Respond ONLY in valid JSON matching this schema: {"topPickId": string, "summary": string, "reasons": string[], "rankedIds": string[]}',
          },
        ],
      },
      contents: [
        {
          parts: [{ text: JSON.stringify(promptPayload) }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Gemini API error (${res.status}): ${errorText}`)
  }

  const json = await res.json()
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini returned empty response')
  return aiSchema.parse(JSON.parse(text))
}

export async function POST(request: Request) {
  const parsed = requirementsSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ error: 'Invalid requirements' }, { status: 400 })
  }
  const req = parsed.data
  const candidates = rankLaptops(req).slice(0, 8)
  const [min, max] = effectiveBudget(req)

  const groqKey = process.env.GROQ_API_KEY?.trim()
  const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY)?.trim()

  const promptPayload = {
    requirements: {
      budgetUsd: { min, max: Number.isFinite(max) ? max : 'no limit' },
      useCases: req.useCases,
      priorities: req.preferences,
      description: req.description || undefined,
    },
    candidates: candidates.map((l) => {
      const best = bestPrice(l)
      return {
        id: l.id,
        name: `${l.brand} ${l.model}`,
        bestPrice: best.price,
        retailer: best.retailer,
        cpu: l.cpu,
        gpu: l.gpu,
        ramGb: l.ramGb,
        storage: formatStorage(l.storageGb),
        screen: l.screen,
        batteryHrs: l.batteryHrs,
        weightLbs: l.weightLbs,
      }
    }),
  }

  try {
    let output: AIResponse | null = null

    // 1. Try Groq (Llama 3 open-source) first if key is present
    if (groqKey) {
      try {
        output = await callGroq(promptPayload, groqKey)
      } catch (err) {
        console.warn('[LapWise] Groq call failed, attempting fallback...', err)
      }
    }

    // 2. Try Google Gemini if Groq wasn't used or failed
    if (!output && geminiKey) {
      try {
        output = await callGemini(promptPayload, geminiKey)
      } catch (err) {
        console.warn('[LapWise] Gemini call failed, attempting heuristic fallback...', err)
      }
    }

    if (!output) {
      console.info('[LapWise] No AI API key configured or AI calls failed. Serving heuristic recommendation.')
      return Response.json(heuristicRecommendation(req))
    }

    const byId = new Map(LAPTOPS.map((l) => [l.id, l]))
    const topPick = byId.get(output.topPickId)
    if (!topPick) {
      throw new Error(`AI returned unknown topPickId: ${output.topPickId}`)
    }

    const rankedFromAi = output.rankedIds
      .map((id) => byId.get(id))
      .filter((l): l is NonNullable<typeof l> => Boolean(l) && l!.id !== topPick.id)
    const seen = new Set([topPick.id, ...rankedFromAi.map((l) => l.id)])
    const ranked = [...rankedFromAi, ...rankLaptops(req).filter((l) => !seen.has(l.id))]

    const result: Recommendation = {
      topPick,
      reasons: output.reasons,
      summary: output.summary,
      ranked,
      source: 'ai',
    }
    return Response.json(result)
  } catch (error) {
    console.error('[LapWise] AI recommendation failed, falling back to heuristic engine:', error)
    return Response.json(heuristicRecommendation(req))
  }
}

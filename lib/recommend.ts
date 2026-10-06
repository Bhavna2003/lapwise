import { z } from 'zod'
import {
  LAPTOPS,
  PREFERENCES,
  USE_CASES,
  bestPrice,
  portabilityRating,
  type Laptop,
  type PreferenceId,
  type UseCaseId,
} from './laptops'

export const BUDGET_MIN = 500
export const BUDGET_MAX = 3000

export const requirementsSchema = z.object({
  budget: z.tuple([z.number().min(0).max(10000), z.number().min(0).max(10000)]),
  useCases: z.array(z.enum(USE_CASES.map((u) => u.id) as [UseCaseId, ...UseCaseId[]])).max(5),
  preferences: z.array(z.enum(PREFERENCES.map((p) => p.id) as [PreferenceId, ...PreferenceId[]])).max(4),
  description: z.string().max(500),
})

export type Requirements = z.infer<typeof requirementsSchema>

export type Recommendation = {
  topPick: Laptop
  reasons: string[]
  summary: string
  ranked: Laptop[]
  source: 'ai' | 'heuristic'
}

function parseDescription(description: string) {
  const text = description.toLowerCase()
  const ram = text.match(/(\d{1,2})\s?gb\s?(?:of\s)?ram/)
  const price = text.match(/(?:under|below|less than|max|<)\s?\$?\s?(\d[\d,]{2,})/)
  return {
    minRam: ram ? Number(ram[1]) : undefined,
    maxPrice: price ? Number(price[1].replace(/,/g, '')) : undefined,
  }
}

export function effectiveBudget(req: Requirements): [number, number] {
  const { maxPrice } = parseDescription(req.description)
  const upper = req.budget[1] >= BUDGET_MAX ? Infinity : req.budget[1]
  return [req.budget[0], maxPrice ? Math.min(upper, maxPrice) : upper]
}

export function scoreLaptop(laptop: Laptop, req: Requirements) {
  const price = bestPrice(laptop).price
  const [min, max] = effectiveBudget(req)
  const { minRam } = parseDescription(req.description)
  let score = 0

  if (price <= max) score += 40
  else score -= (price - max) / 25
  if (price < min) score -= (min - price) / 100

  for (const useCase of req.useCases) {
    if (laptop.useCases.includes(useCase)) score += 18
  }
  if (req.useCases.includes('gaming')) score += laptop.scores.gpu / 4
  if (req.useCases.includes('video')) score += laptop.scores.gpu / 8 + laptop.scores.display
  if (req.useCases.includes('software')) score += laptop.ramGb / 2 + laptop.scores.cpu / 2000
  if (req.useCases.includes('travel')) score += portabilityRating(laptop) * 2

  if (req.preferences.includes('battery')) score += laptop.batteryHrs * 1.4
  if (req.preferences.includes('display')) score += laptop.scores.display * 2.2
  if (req.preferences.includes('weight')) score += portabilityRating(laptop) * 2.5
  if (req.preferences.includes('storage')) score += Math.log2(laptop.storageGb / 128) * 4

  if (minRam && laptop.ramGb < minRam) score -= 30

  score += (laptop.scores.cpu / 22500) * 6
  return score
}

export function rankLaptops(req: Requirements) {
  return [...LAPTOPS].sort((a, b) => scoreLaptop(b, req) - scoreLaptop(a, req))
}

function heuristicReasons(laptop: Laptop, req: Requirements): string[] {
  const price = bestPrice(laptop)
  const [, max] = effectiveBudget(req)
  const reasons: string[] = []
  if (price.price <= max) {
    reasons.push(
      `Fits your budget at ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price.price)} at ${price.retailer}, ${laptop.msrp - price.price > 0 ? `$${laptop.msrp - price.price} below MSRP` : 'right at MSRP'}.`,
    )
  }
  const matched = USE_CASES.filter((u) => req.useCases.includes(u.id) && laptop.useCases.includes(u.id))
  if (matched.length) reasons.push(`Built for ${matched.map((m) => m.label.toLowerCase()).join(' and ')} workloads.`)
  reasons.push(`${laptop.ramGb}GB RAM and a ${laptop.cpu} keep multitasking smooth.`)
  if (req.preferences.includes('battery') || req.useCases.includes('student'))
    reasons.push(`Up to ${laptop.batteryHrs} hours of battery for a full day away from outlets.`)
  if (req.preferences.includes('weight') || req.useCases.includes('travel'))
    reasons.push(`At ${laptop.weightLbs} lbs it's easy to carry between classes or flights.`)
  if (req.preferences.includes('display')) reasons.push(`Excellent ${laptop.screen} panel.`)
  if (req.useCases.includes('gaming')) reasons.push(`${laptop.gpu} handles modern games at high settings.`)
  return reasons.slice(0, 5)
}

export function heuristicRecommendation(req: Requirements): Recommendation {
  const ranked = rankLaptops(req)
  const topPick = ranked[0]
  return {
    topPick,
    reasons: heuristicReasons(topPick, req),
    summary: `The ${topPick.brand} ${topPick.model} offers the strongest balance of price, performance and fit for these requirements.`,
    ranked: ranked.slice(1),
    source: 'heuristic',
  }
}

export const DEFAULT_REQUIREMENTS: Requirements = {
  budget: [600, 1200],
  useCases: ['student', 'software'],
  preferences: ['battery', 'weight'],
  description: '',
}

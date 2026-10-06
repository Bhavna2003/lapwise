'use client'

import { AlertCircle } from 'lucide-react'
import { useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Recommendation, Requirements } from '@/lib/recommend'
import { ComparisonSection } from './comparison-section'
import { RequirementBuilder } from './requirement-builder'
import { TopPickCard } from './top-pick-card'

function ResultSkeleton() {
  return (
    <Card className="p-0" aria-busy="true" aria-label="Loading recommendation">
      <CardContent className="grid gap-6 p-7 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="aspect-[4/3] w-full" />
          <Skeleton className="h-8 w-2/3" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-48" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
          <Skeleton className="mt-4 h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function Advisor({ initialRequirements, initialResult }: { initialRequirements: Requirements; initialResult: Recommendation }) {
  const [result, setResult] = useState(initialResult)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(req: Requirements) {
    setLoading(true)
    setError(null)
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      })
      if (!res.ok) throw new Error('Request failed')
      setResult(await res.json())
    } catch {
      setError('We could not reach the advisor. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[60rem] max-w-full -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)] opacity-40"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-5">
            <p className="font-mono text-xs uppercase tracking-widest text-highlight">AI laptop advisor</p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              The right laptop. <span className="bg-gradient-to-r from-primary to-highlight bg-clip-text text-transparent">The best price.</span>
            </h1>
            <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
              Tell us what you or a friend need. LaptopWise weighs specs, benchmarks and retailer prices, then explains exactly why its pick fits.
            </p>
            <dl className="mt-2 grid max-w-md grid-cols-3 gap-4">
              {[
                ['14', 'Curated models'],
                ['4', 'Retailers compared'],
                ['<10s', 'To a pick'],
              ].map(([value, label]) => (
                <div key={label} className="flex flex-col gap-0.5 border-l-2 border-primary/40 pl-3">
                  <dt className="order-2 text-xs text-muted-foreground">{label}</dt>
                  <dd className="font-mono text-xl font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <RequirementBuilder initial={initialRequirements} loading={loading} onSubmit={handleSubmit} />
        </div>
      </section>

      <div ref={resultsRef} className="mx-auto flex max-w-7xl scroll-mt-20 flex-col gap-16 px-4 py-12 sm:px-6 sm:py-16">
        <section aria-labelledby="result-heading" aria-live="polite" className="flex flex-col gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-highlight">Recommendation</p>
            <h2 id="result-heading" className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {result.source === 'ai' ? 'Your AI-matched laptop' : 'Popular pick for students & developers'}
            </h2>
          </div>
          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="size-4" aria-hidden="true" />
              {error}
            </div>
          )}
          {loading ? <ResultSkeleton /> : <TopPickCard key={result.topPick.id + result.reasons[0]} recommendation={result} />}
        </section>

        {!loading && <ComparisonSection key={result.topPick.id} ranked={result.ranked} />}
      </div>
    </>
  )
}

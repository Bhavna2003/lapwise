import { Advisor } from '@/components/laptopwise/advisor'
import { SiteHeader } from '@/components/laptopwise/site-header'
import { DEFAULT_REQUIREMENTS, heuristicRecommendation } from '@/lib/recommend'

export default function Home() {
  const initialResult = heuristicRecommendation(DEFAULT_REQUIREMENTS)

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main>
        <Advisor initialRequirements={DEFAULT_REQUIREMENTS} initialResult={initialResult} />
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
          <p>© 2026 LapWise AI. Recommendations powered by AI models & spec benchmarks.</p>
          <p>Retailer prices shown are demo data. Always confirm at checkout.</p>
        </div>
      </footer>
    </div>
  )
}

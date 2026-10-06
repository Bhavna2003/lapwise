'use client'

import { Crown, Info, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  bestPrice,
  discountPercent,
  formatPrice,
  formatStorage,
  portabilityRating,
  pricePerformance,
  type Laptop,
} from '@/lib/laptops'
import { cn } from '@/lib/utils'
import { ComparisonFilters, type FilterState } from './comparison-filters'
import { LaptopVisual } from './laptop-visual'

const METRICS = [
  {
    id: 'cpu',
    label: 'CPU benchmark',
    hint: 'Multi-core benchmark score (higher is faster).',
    value: (l: Laptop) => l.scores.cpu,
    format: (v: number) => v.toLocaleString('en-US'),
  },
  {
    id: 'gpu',
    label: 'GPU performance',
    hint: 'Relative graphics index, 0–100.',
    value: (l: Laptop) => l.scores.gpu,
    format: (v: number) => `${v}/100`,
  },
  {
    id: 'portability',
    label: 'Portability',
    hint: 'Combines weight and battery life, 1–10.',
    value: (l: Laptop) => portabilityRating(l),
    format: (v: number) => `${v}/10`,
  },
  {
    id: 'value',
    label: 'Price / Performance',
    hint: 'Performance index per $1,000 at the best current price.',
    value: (l: Laptop) => pricePerformance(l),
    format: (v: number) => v.toFixed(1),
  },
] as const

type MetricId = (typeof METRICS)[number]['id']

const CPU_GEN_ORDER = [
  'Apple M4',
  'Intel Core Ultra 200HX',
  'Intel Core Ultra 200V',
  'AMD Ryzen AI 300',
  'Snapdragon X',
  'AMD Ryzen 8000',
  'Intel 13th Gen',
]

function applyFilters(laptops: Laptop[], state: FilterState) {
  const filtered = laptops.filter(
    (l) => (!state.brands.length || state.brands.includes(l.brand)) && (!state.cpuGens.length || state.cpuGens.includes(l.cpuGen)),
  )
  switch (state.sort) {
    case 'price-asc':
      return filtered.sort((a, b) => bestPrice(a).price - bestPrice(b).price)
    case 'price-desc':
      return filtered.sort((a, b) => bestPrice(b).price - bestPrice(a).price)
    case 'discount':
      return filtered.sort((a, b) => discountPercent(b) - discountPercent(a))
    case 'cpu-gen':
      return filtered.sort((a, b) => CPU_GEN_ORDER.indexOf(a.cpuGen) - CPU_GEN_ORDER.indexOf(b.cpuGen))
    default:
      return filtered
  }
}

export function ComparisonSection({ ranked }: { ranked: Laptop[] }) {
  const [metricId, setMetricId] = useState<MetricId>('cpu')
  const [filters, setFilters] = useState<FilterState>({ sort: 'rank', brands: [], cpuGens: [] })

  const brands = useMemo(() => [...new Set(ranked.map((l) => l.brand))].sort(), [ranked])
  const cpuGens = useMemo(() => CPU_GEN_ORDER.filter((g) => ranked.some((l) => l.cpuGen === g)), [ranked])
  const shown = applyFilters([...ranked], filters).slice(0, 3)

  const metric = METRICS.find((m) => m.id === metricId)!
  const values = shown.map((l) => metric.value(l))
  const maxValue = Math.max(...values, 1)
  const winnerId = shown.length ? shown[values.indexOf(maxValue)]?.id : undefined

  const filterPanel = <ComparisonFilters state={filters} onChange={setFilters} brands={brands} cpuGens={cpuGens} />

  const rows: { label: string; render: (l: Laptop) => React.ReactNode }[] = [
    { label: 'Best price', render: (l) => <span className="font-mono font-semibold text-primary">{formatPrice(bestPrice(l).price)}</span> },
    { label: 'Deal', render: (l) => (discountPercent(l) > 0 ? <span className="text-success">{discountPercent(l)}% off</span> : '—') },
    { label: 'CPU', render: (l) => l.cpu },
    { label: 'GPU', render: (l) => l.gpu },
    { label: 'RAM', render: (l) => `${l.ramGb}GB` },
    { label: 'Storage', render: (l) => formatStorage(l.storageGb) },
    { label: 'Display', render: (l) => l.screen },
    { label: 'Battery', render: (l) => `${l.batteryHrs} hrs` },
    { label: 'Weight', render: (l) => `${l.weightLbs} lbs` },
  ]

  return (
    <section aria-labelledby="compare-heading" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-highlight">Compare</p>
          <h2 id="compare-heading" className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Top 3 alternatives
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Side-by-side specs for the next-best matches.</p>
        </div>
        <Sheet>
          <SheetTrigger render={<Button variant="outline" className="gap-2 lg:hidden" />}>
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filters
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter alternatives</SheetTitle>
              <SheetDescription>Refine which laptops appear in the comparison.</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-6">{filterPanel}</div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          <Card className="sticky top-24">
            <CardContent>{filterPanel}</CardContent>
          </Card>
        </aside>

        <div className="flex min-w-0 flex-col gap-4">
          <ToggleGroup
            value={[metricId]}
            onValueChange={(v) => v[0] && setMetricId(v[0] as MetricId)}
            className="flex w-full flex-wrap gap-2"
            spacing={2}
            aria-label="Comparison metric"
          >
            {METRICS.map((m) => (
              <ToggleGroupItem
                key={m.id}
                value={m.id}
                className="h-9 rounded-full border border-border bg-background px-4 text-sm font-normal transition-all hover:border-primary/40 data-[pressed]:border-primary data-[pressed]:bg-primary data-[pressed]:text-primary-foreground"
              >
                {m.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {shown.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No laptops match these filters. Try removing a brand or CPU filter.
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <Table className="min-w-[640px] table-fixed">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-32 align-bottom">
                        <span className="sr-only">Spec</span>
                      </TableHead>
                      {shown.map((l) => (
                        <TableHead key={l.id} className="h-auto whitespace-normal py-4 align-top">
                          <div className="flex flex-col gap-3">
                            <LaptopVisual laptop={l} size="sm" />
                            <div>
                              <p className="text-xs font-normal text-muted-foreground">{l.brand}</p>
                              <p className="text-sm font-semibold leading-snug text-foreground">{l.model}</p>
                            </div>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-primary/5 hover:bg-primary/10">
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-1.5">
                          {metric.label}
                          <Tooltip>
                            <TooltipTrigger className="text-muted-foreground hover:text-foreground" aria-label={`About ${metric.label}`}>
                              <Info className="size-3.5" aria-hidden="true" />
                            </TooltipTrigger>
                            <TooltipContent>{metric.hint}</TooltipContent>
                          </Tooltip>
                        </span>
                      </TableCell>
                      {shown.map((l, i) => {
                        const isWinner = l.id === winnerId
                        return (
                          <TableCell key={l.id} className="whitespace-normal">
                            <div className="flex flex-col gap-1.5">
                              <span className="flex items-center gap-1.5 font-mono text-sm font-semibold tabular-nums">
                                {metric.format(values[i])}
                                {isWinner && (
                                  <Badge className="h-5 gap-1 bg-highlight px-1.5 text-[10px] text-highlight-foreground">
                                    <Crown className="size-2.5" aria-hidden="true" />
                                    Best
                                  </Badge>
                                )}
                              </span>
                              <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                                <div
                                  className={cn('h-full rounded-full transition-all duration-500', isWinner ? 'bg-highlight' : 'bg-primary/60')}
                                  style={{ width: `${(values[i] / maxValue) * 100}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                    {rows.map((row) => (
                      <TableRow key={row.label}>
                        <TableCell className="text-muted-foreground">{row.label}</TableCell>
                        {shown.map((l) => (
                          <TableCell key={l.id} className="whitespace-normal text-sm">
                            {row.render(l)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}

'use client'

import { Check, Info, Sparkles, Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { bestPrice, discountPercent, formatPrice } from '@/lib/laptops'
import type { Recommendation } from '@/lib/recommend'
import { LaptopVisual } from './laptop-visual'
import { PriceMatrix } from './price-matrix'
import { SpecList } from './spec-list'

export function TopPickCard({ recommendation }: { recommendation: Recommendation }) {
  const { topPick: laptop, reasons, summary, source } = recommendation
  const best = bestPrice(laptop)
  const discount = discountPercent(laptop)

  return (
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-0 shadow-2xl shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardContent className="grid gap-0 p-0 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col gap-6 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="gap-1 bg-gradient-to-r from-primary to-highlight text-primary-foreground">
              <Trophy className="size-3" aria-hidden="true" />
              Top Pick
            </Badge>
            {discount > 0 && (
              <Badge variant="outline" className="border-success/40 text-success">
                {discount}% off MSRP
              </Badge>
            )}
            <Tooltip>
              <TooltipTrigger
                render={<Badge variant="secondary" className="cursor-help gap-1" />}
              >
                <Sparkles className="size-3" aria-hidden="true" />
                {source === 'ai' ? 'AI ranked' : 'Smart match'}
              </TooltipTrigger>
              <TooltipContent>
                {source === 'ai' ? 'Ranked by LapWise AI (Llama 3 / Gemini)' : 'Ranked by LapWise smart match'}
              </TooltipContent>
            </Tooltip>
          </div>

          <LaptopVisual laptop={laptop} />

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{laptop.brand}</p>
              <h3 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{laptop.model}</h3>
            </div>
            <div className="text-right">
              <p className="font-mono text-3xl font-semibold tabular-nums text-primary">{formatPrice(best.price)}</p>
              <p className="text-xs text-muted-foreground">
                at {best.retailer} · MSRP <span className="line-through">{formatPrice(laptop.msrp)}</span>
              </p>
            </div>
          </div>

          <SpecList laptop={laptop} compact />
        </div>

        <div className="flex flex-col gap-6 border-t bg-muted/20 p-5 sm:p-7 lg:border-l lg:border-t-0">
          <section aria-labelledby="why-heading" className="flex flex-col gap-3">
            <h4 id="why-heading" className="flex items-center gap-2 text-base font-semibold">
              <Sparkles className="size-4 text-highlight" aria-hidden="true" />
              Why AI Recommended This
            </h4>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{summary}</p>
            <ul className="flex flex-col gap-2.5">
              {reasons.map((reason, i) => (
                <li
                  key={reason}
                  className="flex gap-2.5 text-sm leading-relaxed animate-in fade-in slide-in-from-left-2 fill-mode-both"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          </section>

          <Tabs defaultValue="prices" className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <TabsList>
                <TabsTrigger value="prices">Price Matrix</TabsTrigger>
                <TabsTrigger value="specs">Full Specs</TabsTrigger>
              </TabsList>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                Demo prices
              </span>
            </div>
            <TabsContent value="prices" className="animate-in fade-in duration-300">
              <PriceMatrix laptop={laptop} />
            </TabsContent>
            <TabsContent value="specs" className="flex flex-col gap-3 animate-in fade-in duration-300">
              <SpecList laptop={laptop} />
              <Dialog>
                <DialogTrigger render={<Button variant="outline" className="gap-2" />}>
                  <Info className="size-4" aria-hidden="true" />
                  How we score laptops
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>How LaptopWise scores laptops</DialogTitle>
                    <DialogDescription>
                      We pre-filter our catalog with a transparent scoring model, then an open-weight AI model weighs the trade-offs and writes the reasoning.
                    </DialogDescription>
                  </DialogHeader>
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">Budget fit:</strong> lowest live retailer price vs. your range.</li>
                    <li><strong className="text-foreground">Use case match:</strong> CPU, GPU and RAM headroom for your workloads.</li>
                    <li><strong className="text-foreground">Priorities:</strong> battery, display quality, weight and storage you selected.</li>
                    <li><strong className="text-foreground">Free text:</strong> hard limits like RAM or max price are parsed from your description.</li>
                  </ul>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

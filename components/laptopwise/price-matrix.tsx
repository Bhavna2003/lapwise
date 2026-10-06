import { ArrowUpRight, BadgeCheck, Store } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { bestPrice, formatPrice, type Laptop } from '@/lib/laptops'
import { cn } from '@/lib/utils'

function dealUrl(retailer: string, laptop: Laptop) {
  const q = encodeURIComponent(`${laptop.brand} ${laptop.model}`)
  switch (retailer) {
    case 'Best Buy':
      return `https://www.bestbuy.com/site/searchpage.jsp?st=${q}`
    case 'Amazon':
      return `https://www.amazon.com/s?k=${q}`
    case 'Micro Center':
      return `https://www.microcenter.com/search/search_results.aspx?Ntt=${q}`
    default:
      return `https://www.bhphotovideo.com/c/search?q=${q}`
  }
}

export function PriceMatrix({ laptop }: { laptop: Laptop }) {
  const best = bestPrice(laptop)
  const sorted = [...laptop.prices].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))

  return (
    <ul className="flex flex-col gap-2" aria-label="Retailer prices">
      {sorted.map((p) => {
        const isBest = p.retailer === best.retailer
        const savings = p.price ? laptop.msrp - p.price : 0
        return (
          <li
            key={p.retailer}
            className={cn(
              'group flex items-center gap-3 rounded-lg border p-3 transition-all',
              isBest ? 'border-success/40 bg-success/5' : 'hover:border-primary/30 hover:bg-muted/50',
              !p.price && 'opacity-60',
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Store className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{p.retailer}</span>
                {isBest && (
                  <Badge className="gap-1 bg-success text-success-foreground">
                    <BadgeCheck className="size-3" aria-hidden="true" />
                    Best Price
                  </Badge>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">{p.price ? p.shipping : 'Currently unavailable'}</p>
            </div>
            <div className="text-right">
              <p className={cn('font-mono text-sm font-semibold tabular-nums', isBest && 'text-success')}>
                {p.price ? formatPrice(p.price) : '—'}
              </p>
              {savings > 0 && <p className="font-mono text-[11px] text-muted-foreground line-through">{formatPrice(laptop.msrp)}</p>}
            </div>
            {p.price ? (
              <Button
                size="sm"
                variant={isBest ? 'default' : 'outline'}
                className="shrink-0 gap-1"
                nativeButton={false}
                render={<a href={dealUrl(p.retailer, laptop)} target="_blank" rel="noopener noreferrer" />}
              >
                View Deal
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                <span className="sr-only">at {p.retailer} (opens in new tab)</span>
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled className="shrink-0">
                Sold out
              </Button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

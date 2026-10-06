import type { Laptop } from '@/lib/laptops'
import { cn } from '@/lib/utils'

export function LaptopVisual({ laptop, className, size = 'lg' }: { laptop: Laptop; className?: string; size?: 'sm' | 'lg' }) {
  const [from, to] = laptop.wallpaper
  return (
    <div
      role="img"
      aria-label={`${laptop.brand} ${laptop.model}`}
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-muted to-secondary',
        size === 'lg' ? 'aspect-[4/3] p-8' : 'aspect-[16/10] p-4',
        className,
      )}
    >
      <div
        className="absolute inset-x-10 bottom-6 h-10 rounded-full opacity-40 blur-2xl"
        style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[85%]">
        <div className="rounded-t-lg border-[3px] border-b-0 border-zinc-800 bg-zinc-900 p-1 shadow-xl dark:border-zinc-700">
          <div
            className="flex aspect-[16/10] items-end rounded-sm p-2"
            style={{ background: `radial-gradient(circle at 30% 20%, ${to}, transparent 60%), linear-gradient(135deg, ${from}, #0b0b12)` }}
          >
            {size === 'lg' && (
              <span className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white/90 backdrop-blur-sm">
                {laptop.brand}
              </span>
            )}
          </div>
        </div>
        <div className="relative mx-[-6%] h-2.5 rounded-b-lg bg-gradient-to-b from-zinc-300 to-zinc-400 shadow-md dark:from-zinc-500 dark:to-zinc-600">
          <div className="absolute left-1/2 top-0 h-1 w-1/6 -translate-x-1/2 rounded-b bg-zinc-400 dark:bg-zinc-700" />
        </div>
      </div>
    </div>
  )
}

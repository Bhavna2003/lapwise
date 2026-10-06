'use client'

import { Laptop, Moon, Sparkles, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5" aria-label="LapWise AI home">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-highlight text-primary-foreground shadow-sm">
            <Laptop className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            LapWise <span className="text-primary">AI</span>
          </span>
        </a>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden gap-1.5 border-highlight/30 bg-accent text-accent-foreground sm:inline-flex">
            <Sparkles className="size-3" aria-hidden="true" />
            Powered by Open-Source AI
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle color theme"
          >
            <Sun className="size-4 dark:hidden" aria-hidden="true" />
            <Moon className="hidden size-4 dark:block" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}

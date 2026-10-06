'use client'

import { BatteryFull, Briefcase, Code2, Film, Gamepad2, GraduationCap, HardDrive, Loader2, Monitor, Plane, Search, Feather } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { PREFERENCES, USE_CASES, formatPrice, type PreferenceId, type UseCaseId } from '@/lib/laptops'
import { BUDGET_MAX, BUDGET_MIN, type Requirements } from '@/lib/recommend'

const USE_CASE_ICONS: Record<UseCaseId, typeof Gamepad2> = {
  gaming: Gamepad2,
  software: Code2,
  video: Film,
  student: GraduationCap,
  travel: Plane,
}

const PREFERENCE_ICONS: Record<PreferenceId, typeof Gamepad2> = {
  battery: BatteryFull,
  display: Monitor,
  weight: Feather,
  storage: HardDrive,
}

const EXAMPLES = [
  'A light laptop for a CS major with 16GB RAM under $900',
  'Gaming laptop for my nephew that can run Fortnite and Valorant',
  'Something durable for a video editing freelancer, budget is flexible',
]

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 flex items-center gap-2.5 text-sm font-medium">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 font-mono text-xs text-primary">{n}</span>
        {title}
        {hint && <span className="font-normal text-muted-foreground">{hint}</span>}
      </legend>
      {children}
    </fieldset>
  )
}

const chipClass =
  'h-auto gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-sm font-normal transition-all hover:-translate-y-0.5 hover:border-primary/40 data-[pressed]:border-primary data-[pressed]:bg-primary/10 data-[pressed]:text-primary'

export function RequirementBuilder({
  initial,
  loading,
  onSubmit,
}: {
  initial: Requirements
  loading: boolean
  onSubmit: (req: Requirements) => void
}) {
  const [budget, setBudget] = useState<[number, number]>(initial.budget)
  const [useCases, setUseCases] = useState<UseCaseId[]>(initial.useCases)
  const [preferences, setPreferences] = useState<PreferenceId[]>(initial.preferences)
  const [description, setDescription] = useState(initial.description)

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    onSubmit({ budget, useCases, preferences, description: description.trim() })
  }

  return (
    <Card className="relative overflow-hidden border-primary/20 shadow-xl shadow-primary/5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" aria-hidden="true" />
      <CardContent className="p-5 sm:p-7">
        <form onSubmit={submit} className="flex flex-col gap-7">
          <Step n={1} title="Budget range" hint={`${formatPrice(budget[0])} – ${budget[1] >= BUDGET_MAX ? `${formatPrice(BUDGET_MAX)}+` : formatPrice(budget[1])}`}>
            <Slider
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={50}
              value={budget}
              onValueChange={(v) => Array.isArray(v) && setBudget([v[0], v[1]])}
              aria-label="Budget range"
              className="py-2"
            />
            <div className="flex justify-between font-mono text-xs text-muted-foreground">
              <span>{formatPrice(BUDGET_MIN)}</span>
              <span>{formatPrice(BUDGET_MAX)}+</span>
            </div>
          </Step>

          <Step n={2} title="Primary use case" hint="Pick any">
            <ToggleGroup multiple value={useCases} onValueChange={(v) => setUseCases(v as UseCaseId[])} className="flex w-full flex-wrap gap-2" spacing={2}>
              {USE_CASES.map((u) => {
                const Icon = USE_CASE_ICONS[u.id]
                return (
                  <ToggleGroupItem key={u.id} value={u.id} className={chipClass}>
                    <Icon className="size-4" aria-hidden="true" />
                    {u.label}
                  </ToggleGroupItem>
                )
              })}
            </ToggleGroup>
          </Step>

          <Step n={3} title="What matters most?">
            <ToggleGroup
              multiple
              value={preferences}
              onValueChange={(v) => setPreferences(v as PreferenceId[])}
              className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4"
              spacing={2}
            >
              {PREFERENCES.map((p) => {
                const Icon = PREFERENCE_ICONS[p.id]
                return (
                  <ToggleGroupItem
                    key={p.id}
                    value={p.id}
                    className="h-auto w-full flex-col items-start gap-2 rounded-lg border border-border bg-background p-3 text-left text-sm font-normal transition-all hover:border-primary/40 data-[pressed]:border-primary data-[pressed]:bg-primary/10 data-[pressed]:text-primary"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {p.label}
                  </ToggleGroupItem>
                )
              })}
            </ToggleGroup>
          </Step>

          <Step n={4} title="Describe what your friend needs" hint="Optional">
            <label htmlFor="description" className="sr-only">
              Describe what your friend needs
            </label>
            <Textarea
              id="description"
              value={description}
              maxLength={500}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing && e.keyCode !== 229) submit()
              }}
              placeholder="e.g., 'A light laptop for CS major with 16GB RAM under $900'"
              className="min-h-24 resize-none bg-background"
            />
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setDescription(example)}
                  className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Briefcase className="size-3" aria-hidden="true" />
                  {example}
                </button>
              ))}
            </div>
          </Step>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="h-12 w-full gap-2 bg-gradient-to-r from-primary to-highlight text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
          >
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Search className="size-4" aria-hidden="true" />}
            {loading ? 'Analyzing laptops & prices…' : 'Find Best Laptop Deals'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

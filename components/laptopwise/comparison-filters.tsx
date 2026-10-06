'use client'

import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export const SORT_OPTIONS = [
  { value: 'rank', label: 'AI rank' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'discount', label: 'Deal discount %' },
  { value: 'cpu-gen', label: 'CPU generation' },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]['value']

export type FilterState = {
  sort: SortValue
  brands: string[]
  cpuGens: string[]
}

export function ComparisonFilters({
  state,
  onChange,
  brands,
  cpuGens,
}: {
  state: FilterState
  onChange: (state: FilterState) => void
  brands: string[]
  cpuGens: string[]
}) {
  function toggle(key: 'brands' | 'cpuGens', value: string, checked: boolean) {
    const next = checked ? [...state[key], value] : state[key].filter((v) => v !== value)
    onChange({ ...state, [key]: next })
  }

  const active = state.brands.length + state.cpuGens.length > 0 || state.sort !== 'rank'

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="sort-by">Sort by</Label>
        <Select
          items={SORT_OPTIONS}
          value={state.sort}
          onValueChange={(v) => v && onChange({ ...state, sort: v as SortValue })}
        >
          <SelectTrigger id="sort-by" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-sm font-medium">Brand</legend>
        {brands.map((brand) => (
          <Label key={brand} className="flex cursor-pointer items-center gap-2.5 font-normal">
            <Checkbox checked={state.brands.includes(brand)} onCheckedChange={(c) => toggle('brands', brand, c === true)} />
            {brand}
          </Label>
        ))}
      </fieldset>

      <Separator />

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-sm font-medium">CPU generation</legend>
        {cpuGens.map((gen) => (
          <Label key={gen} className="flex cursor-pointer items-center gap-2.5 font-normal">
            <Checkbox checked={state.cpuGens.includes(gen)} onCheckedChange={(c) => toggle('cpuGens', gen, c === true)} />
            {gen}
          </Label>
        ))}
      </fieldset>

      {active && (
        <Button variant="ghost" size="sm" className="gap-2 self-start" onClick={() => onChange({ sort: 'rank', brands: [], cpuGens: [] })}>
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Reset filters
        </Button>
      )}
    </div>
  )
}

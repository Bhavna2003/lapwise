import { BatteryFull, Cpu, Gauge, HardDrive, MemoryStick, Monitor, Weight } from 'lucide-react'
import { formatStorage, type Laptop } from '@/lib/laptops'

export function getSpecs(laptop: Laptop) {
  return [
    { icon: Cpu, label: 'CPU', value: laptop.cpu },
    { icon: Gauge, label: 'GPU', value: laptop.gpu },
    { icon: MemoryStick, label: 'RAM', value: `${laptop.ramGb}GB` },
    { icon: HardDrive, label: 'Storage', value: formatStorage(laptop.storageGb) },
    { icon: Monitor, label: 'Screen', value: laptop.screen },
    { icon: BatteryFull, label: 'Battery', value: `Up to ${laptop.batteryHrs} hrs` },
    { icon: Weight, label: 'Weight', value: `${laptop.weightLbs} lbs` },
  ]
}

export function SpecList({ laptop, compact = false }: { laptop: Laptop; compact?: boolean }) {
  const specs = getSpecs(laptop).slice(0, compact ? 6 : undefined)
  return (
    <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {specs.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-2.5 rounded-lg bg-muted/60 p-2.5">
          <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
            <dd className="text-sm leading-snug">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}

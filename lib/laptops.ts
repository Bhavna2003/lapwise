export const USE_CASES = [
  { id: 'gaming', label: 'Gaming' },
  { id: 'software', label: 'Software Engineering' },
  { id: 'video', label: 'Video Editing' },
  { id: 'student', label: 'Everyday Student' },
  { id: 'travel', label: 'Portability / Travel' },
] as const

export const PREFERENCES = [
  { id: 'battery', label: 'Battery Life' },
  { id: 'display', label: 'Display Quality' },
  { id: 'weight', label: 'Weight / Portability' },
  { id: 'storage', label: 'Storage Size' },
] as const

export type UseCaseId = (typeof USE_CASES)[number]['id']
export type PreferenceId = (typeof PREFERENCES)[number]['id']

export const RETAILERS = ['Best Buy', 'Amazon', 'Micro Center', 'B&H Photo'] as const
export type Retailer = (typeof RETAILERS)[number]

export type RetailerPrice = {
  retailer: Retailer
  price: number | null
  shipping: string
}

export type Laptop = {
  id: string
  brand: string
  model: string
  msrp: number
  cpu: string
  cpuGen: string
  gpu: string
  ramGb: number
  storageGb: number
  screen: string
  batteryHrs: number
  weightLbs: number
  useCases: UseCaseId[]
  scores: {
    cpu: number
    gpu: number
    display: number
  }
  wallpaper: [string, string]
  prices: RetailerPrice[]
}

function prices(
  bestBuy: number | null,
  amazon: number | null,
  microCenter: number | null,
  bh: number | null,
): RetailerPrice[] {
  return [
    { retailer: 'Best Buy', price: bestBuy, shipping: 'Free pickup today' },
    { retailer: 'Amazon', price: amazon, shipping: 'Free 2-day shipping' },
    { retailer: 'Micro Center', price: microCenter, shipping: 'In-store only' },
    { retailer: 'B&H Photo', price: bh, shipping: 'Free expedited' },
  ]
}

export const LAPTOPS: Laptop[] = [
  {
    id: 'macbook-air-13-m4',
    brand: 'Apple',
    model: 'MacBook Air 13" (M4, 2025)',
    msrp: 999,
    cpu: 'Apple M4 10-core',
    cpuGen: 'Apple M4',
    gpu: 'Apple 8-core GPU',
    ramGb: 16,
    storageGb: 256,
    screen: '13.6" Liquid Retina 2560×1664, 500 nits',
    batteryHrs: 18,
    weightLbs: 2.7,
    useCases: ['student', 'travel', 'software'],
    scores: { cpu: 14800, gpu: 42, display: 8 },
    wallpaper: ['#6366f1', '#22d3ee'],
    prices: prices(849, 829, 799, 849),
  },
  {
    id: 'macbook-pro-14-m4-pro',
    brand: 'Apple',
    model: 'MacBook Pro 14" (M4 Pro)',
    msrp: 1999,
    cpu: 'Apple M4 Pro 12-core',
    cpuGen: 'Apple M4',
    gpu: 'Apple 16-core GPU',
    ramGb: 24,
    storageGb: 512,
    screen: '14.2" Liquid Retina XDR 3024×1964, 120Hz',
    batteryHrs: 22,
    weightLbs: 3.5,
    useCases: ['video', 'software'],
    scores: { cpu: 22500, gpu: 68, display: 10 },
    wallpaper: ['#4f46e5', '#0ea5e9'],
    prices: prices(1849, 1829, 1799, 1899),
  },
  {
    id: 'dell-xps-13-9350',
    brand: 'Dell',
    model: 'XPS 13 9350',
    msrp: 1399,
    cpu: 'Intel Core Ultra 7 258V',
    cpuGen: 'Intel Core Ultra 200V',
    gpu: 'Intel Arc 140V',
    ramGb: 16,
    storageGb: 512,
    screen: '13.4" FHD+ 120Hz, 500 nits',
    batteryHrs: 16,
    weightLbs: 2.6,
    useCases: ['travel', 'software', 'student'],
    scores: { cpu: 11000, gpu: 38, display: 7 },
    wallpaper: ['#0ea5e9', '#1e293b'],
    prices: prices(1199, 1149, null, 1249),
  },
  {
    id: 'asus-zenbook-14-oled',
    brand: 'ASUS',
    model: 'Zenbook 14 OLED (UM3406)',
    msrp: 1099,
    cpu: 'AMD Ryzen AI 7 350',
    cpuGen: 'AMD Ryzen AI 300',
    gpu: 'AMD Radeon 860M',
    ramGb: 16,
    storageGb: 1024,
    screen: '14" 3K OLED 120Hz, 100% DCI-P3',
    batteryHrs: 15,
    weightLbs: 2.82,
    useCases: ['student', 'travel', 'software'],
    scores: { cpu: 12800, gpu: 40, display: 9 },
    wallpaper: ['#8b5cf6', '#ec4899'],
    prices: prices(899, 879, 849, 929),
  },
  {
    id: 'thinkpad-x1-carbon-g13',
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon Gen 13',
    msrp: 1899,
    cpu: 'Intel Core Ultra 7 268V',
    cpuGen: 'Intel Core Ultra 200V',
    gpu: 'Intel Arc 140V',
    ramGb: 32,
    storageGb: 1024,
    screen: '14" 2.8K OLED, 120Hz',
    batteryHrs: 17,
    weightLbs: 2.18,
    useCases: ['software', 'travel'],
    scores: { cpu: 11400, gpu: 38, display: 9 },
    wallpaper: ['#ef4444', '#18181b'],
    prices: prices(1699, 1649, null, 1729),
  },
  {
    id: 'rog-zephyrus-g14-2025',
    brand: 'ASUS',
    model: 'ROG Zephyrus G14 (2025)',
    msrp: 1999,
    cpu: 'AMD Ryzen AI 9 HX 370',
    cpuGen: 'AMD Ryzen AI 300',
    gpu: 'NVIDIA RTX 5070 Ti 12GB',
    ramGb: 32,
    storageGb: 1024,
    screen: '14" 3K OLED 120Hz',
    batteryHrs: 9,
    weightLbs: 3.5,
    useCases: ['gaming', 'video', 'software'],
    scores: { cpu: 15600, gpu: 82, display: 9 },
    wallpaper: ['#f43f5e', '#7c3aed'],
    prices: prices(1799, 1749, 1699, 1849),
  },
  {
    id: 'legion-pro-7i',
    brand: 'Lenovo',
    model: 'Legion Pro 7i Gen 10',
    msrp: 2999,
    cpu: 'Intel Core Ultra 9 275HX',
    cpuGen: 'Intel Core Ultra 200HX',
    gpu: 'NVIDIA RTX 5080 16GB',
    ramGb: 32,
    storageGb: 2048,
    screen: '16" 2.5K OLED 240Hz',
    batteryHrs: 6,
    weightLbs: 6.0,
    useCases: ['gaming', 'video'],
    scores: { cpu: 21000, gpu: 94, display: 9 },
    wallpaper: ['#f97316', '#1c1917'],
    prices: prices(2699, 2649, 2599, 2749),
  },
  {
    id: 'acer-nitro-v-15',
    brand: 'Acer',
    model: 'Nitro V 15',
    msrp: 849,
    cpu: 'Intel Core i5-13420H',
    cpuGen: 'Intel 13th Gen',
    gpu: 'NVIDIA RTX 4050 6GB',
    ramGb: 16,
    storageGb: 512,
    screen: '15.6" FHD IPS 144Hz',
    batteryHrs: 6,
    weightLbs: 4.6,
    useCases: ['gaming', 'student'],
    scores: { cpu: 9200, gpu: 58, display: 5 },
    wallpaper: ['#22c55e', '#0f172a'],
    prices: prices(699, 679, 649, null),
  },
  {
    id: 'hp-omnibook-5-14',
    brand: 'HP',
    model: 'OmniBook 5 14" OLED',
    msrp: 799,
    cpu: 'Snapdragon X Plus X1P-42',
    cpuGen: 'Snapdragon X',
    gpu: 'Qualcomm Adreno',
    ramGb: 16,
    storageGb: 512,
    screen: '14" 2K OLED, 300 nits',
    batteryHrs: 20,
    weightLbs: 2.9,
    useCases: ['student', 'travel'],
    scores: { cpu: 10200, gpu: 28, display: 8 },
    wallpaper: ['#06b6d4', '#3b82f6'],
    prices: prices(649, 629, null, 669),
  },
  {
    id: 'surface-laptop-7',
    brand: 'Microsoft',
    model: 'Surface Laptop 7 13.8"',
    msrp: 1299,
    cpu: 'Snapdragon X Elite X1E-80',
    cpuGen: 'Snapdragon X',
    gpu: 'Qualcomm Adreno',
    ramGb: 16,
    storageGb: 512,
    screen: '13.8" PixelSense 120Hz touch',
    batteryHrs: 20,
    weightLbs: 2.96,
    useCases: ['student', 'travel', 'software'],
    scores: { cpu: 14200, gpu: 32, display: 8 },
    wallpaper: ['#2563eb', '#a855f7'],
    prices: prices(1049, 999, 999, 1099),
  },
  {
    id: 'razer-blade-16',
    brand: 'Razer',
    model: 'Blade 16 (2025)',
    msrp: 3999,
    cpu: 'AMD Ryzen AI 9 HX 370',
    cpuGen: 'AMD Ryzen AI 300',
    gpu: 'NVIDIA RTX 5090 24GB',
    ramGb: 32,
    storageGb: 2048,
    screen: '16" QHD+ OLED 240Hz',
    batteryHrs: 7,
    weightLbs: 4.71,
    useCases: ['gaming', 'video'],
    scores: { cpu: 15800, gpu: 100, display: 10 },
    wallpaper: ['#22c55e', '#052e16'],
    prices: prices(3799, 3699, null, 3849),
  },
  {
    id: 'ideapad-slim-5',
    brand: 'Lenovo',
    model: 'IdeaPad Slim 5 14"',
    msrp: 749,
    cpu: 'AMD Ryzen 7 8845HS',
    cpuGen: 'AMD Ryzen 8000',
    gpu: 'AMD Radeon 780M',
    ramGb: 16,
    storageGb: 512,
    screen: '14" WUXGA OLED',
    batteryHrs: 13,
    weightLbs: 3.1,
    useCases: ['student', 'software'],
    scores: { cpu: 12000, gpu: 36, display: 7 },
    wallpaper: ['#64748b', '#0ea5e9'],
    prices: prices(579, 549, 529, 599),
  },
  {
    id: 'asus-proart-p16',
    brand: 'ASUS',
    model: 'ProArt P16 (H7606)',
    msrp: 2499,
    cpu: 'AMD Ryzen AI 9 HX 370',
    cpuGen: 'AMD Ryzen AI 300',
    gpu: 'NVIDIA RTX 4070 8GB',
    ramGb: 32,
    storageGb: 2048,
    screen: '16" 4K OLED touch, 100% DCI-P3',
    batteryHrs: 10,
    weightLbs: 4.0,
    useCases: ['video', 'software'],
    scores: { cpu: 15500, gpu: 74, display: 10 },
    wallpaper: ['#eab308', '#7c2d12'],
    prices: prices(2199, 2149, 2099, 2249),
  },
  {
    id: 'framework-13-ryzen-ai',
    brand: 'Framework',
    model: 'Laptop 13 (Ryzen AI 300)',
    msrp: 1099,
    cpu: 'AMD Ryzen AI 5 340',
    cpuGen: 'AMD Ryzen AI 300',
    gpu: 'AMD Radeon 840M',
    ramGb: 16,
    storageGb: 512,
    screen: '13.5" 2.8K 120Hz matte',
    batteryHrs: 11,
    weightLbs: 2.9,
    useCases: ['software', 'student', 'travel'],
    scores: { cpu: 11200, gpu: 33, display: 8 },
    wallpaper: ['#f97316', '#fde047'],
    prices: prices(null, 1049, null, 1079),
  },
]

export function bestPrice(laptop: Laptop) {
  const available = laptop.prices.filter((p): p is RetailerPrice & { price: number } => p.price !== null)
  return available.reduce((best, p) => (p.price < best.price ? p : best), available[0])
}

export function discountPercent(laptop: Laptop) {
  return Math.round(((laptop.msrp - bestPrice(laptop).price) / laptop.msrp) * 100)
}

export function portabilityRating(laptop: Laptop) {
  return Math.max(1, Math.min(10, Math.round((6.5 - laptop.weightLbs) * 2.2 + laptop.batteryHrs / 6)))
}

export function performanceIndex(laptop: Laptop) {
  return (laptop.scores.cpu / 22500) * 60 + (laptop.scores.gpu / 100) * 40
}

export function pricePerformance(laptop: Laptop) {
  return performanceIndex(laptop) / (bestPrice(laptop).price / 1000)
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export function formatStorage(gb: number) {
  return gb >= 1024 ? `${gb / 1024}TB SSD` : `${gb}GB SSD`
}

export type CartLine = { slug: string; quantity: number }

export const CART_KEY = 'miraaya-cart-preview'
export const CART_EVENT = 'miraaya-cart-change'

export function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function readCart(): CartLine[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = window.sessionStorage.getItem(CART_KEY)
    if (!saved) return []
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (line): line is CartLine =>
        typeof line?.slug === 'string' && typeof line?.quantity === 'number' && line.quantity > 0,
    )
  } catch {
    return []
  }
}

export function writeCart(lines: CartLine[]): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(CART_KEY, JSON.stringify(lines))
  } catch {
    /* session storage is optional in preview environments */
  }
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}

export function addToCart(slug: string, quantity = 1): void {
  if (typeof window === 'undefined') return
  const current = readCart()
  const existing = current.find((line) => line.slug === slug)
  const next = existing
    ? current.map((line) => (line.slug === slug ? { ...line, quantity: line.quantity + quantity } : line))
    : [...current, { slug, quantity }]
  writeCart(next)
  window.dispatchEvent(new Event(CART_EVENT))
}

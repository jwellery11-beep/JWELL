'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ChevronRight, Heart, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import SiteFooter from '../../components/site-footer'
import { money, products, type Product } from '../../lib/products'
import styles from './cart.module.css'

type CartLine = { slug: string; quantity: number }
const CART_KEY = 'miraaya-cart-preview'
const shippingCharge = 99
const previewCart: CartLine[] = [
  { slug: 'crystal-drop-earrings', quantity: 1 },
  { slug: 'pearl-stud-earrings', quantity: 1 },
  { slug: 'kundan-jhumka-earrings', quantity: 1 },
]

export default function CartPage() {
  const [lines, setLines] = useState<CartLine[]>(previewCart)
  const [hydrated, setHydrated] = useState(false)
  const [wishes, setWishes] = useState<string[]>([])
  const [notice, setNotice] = useState('')

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(CART_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as CartLine[]
        if (Array.isArray(parsed)) setLines(parsed.filter((line) => products.some((product) => product.slug === line.slug) && line.quantity > 0))
      } else window.sessionStorage.setItem(CART_KEY, JSON.stringify(previewCart))
    } catch { /* session storage is optional in preview environments */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) window.sessionStorage.setItem(CART_KEY, JSON.stringify(lines))
  }, [hydrated, lines])

  const cartItems = lines.flatMap((line) => { const product = products.find((item) => item.slug === line.slug); return product ? [{ product, quantity: line.quantity }] : [] })
  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cartItems])
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const total = subtotal + (cartItems.length ? shippingCharge : 0)
  const recommendations = products.filter((product) => !lines.some((line) => line.slug === product.slug)).slice(0, 4)

  const updateQuantity = (slug: string, amount: number) => setLines((current) => current.map((line) => line.slug === slug ? { ...line, quantity: Math.max(1, line.quantity + amount) } : line))
  const removeLine = (slug: string) => setLines((current) => current.filter((line) => line.slug !== slug))
  const addRecommendation = (product: Product) => {
    setLines((current) => current.some((line) => line.slug === product.slug) ? current.map((line) => line.slug === product.slug ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { slug: product.slug, quantity: 1 }])
    setNotice(`${product.name} added to cart`)
    window.setTimeout(() => setNotice(''), 2200)
  }

  return <main className={styles.page}>
    <header className={styles.header}><button type="button" aria-label="Continue shopping" onClick={() => window.location.assign('/shop')}><ArrowLeft /></button><a href="/" aria-label="Miraaya Jewels home"><img src="/miralogo.png" alt="Miraaya Jewels" /></a><a className={styles.headerCart} href="/cart" aria-label={`${totalItems} items in cart`}><ShoppingBag /><b>{totalItems}</b></a></header>
    <div className={styles.shell}>
      <div className={styles.titleRow}><h1>Your Cart ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})</h1><a href="/shop">Continue Shopping <ChevronRight aria-hidden="true" /></a></div>
      {!cartItems.length ? <section className={styles.empty}><ShoppingBag aria-hidden="true" /><h2>Your cart is empty</h2><p>Discover something beautiful from the Miraaya collection.</p><a href="/shop">Continue Shopping</a></section> : <div className={styles.cartLayout}>
        <section className={styles.items} aria-label="Cart items">{cartItems.map(({ product, quantity }) => <article className={styles.item} key={product.slug}><a className={styles.itemImage} href={`/product/${product.slug}`}><img src={product.image} alt={product.name} /></a><div className={styles.itemInfo}><a className={styles.itemName} href={`/product/${product.slug}`}>{product.name}</a><strong>{money(product.price)}</strong><div className={styles.itemControls}><div className={styles.stepper}><button type="button" aria-label={`Decrease ${product.name} quantity`} onClick={() => updateQuantity(product.slug, -1)}><Minus /></button><span>{quantity}</span><button type="button" aria-label={`Increase ${product.name} quantity`} onClick={() => updateQuantity(product.slug, 1)}><Plus /></button></div></div></div><button type="button" className={styles.remove} aria-label={`Remove ${product.name}`} onClick={() => removeLine(product.slug)}><Trash2 /></button><strong className={styles.lineTotal}>{money(product.price * quantity)}</strong></article>)}</section>
        <aside className={styles.summary} aria-label="Order summary"><div><span>Shipping Charges</span><strong>{money(shippingCharge)}</strong></div><div className={styles.total}><span>Total Amount</span><strong>{money(total)}</strong></div><a className={styles.checkout} href="/checkout">Proceed to Checkout</a><a className={styles.continue} href="/shop">Continue Shopping <ArrowLeft aria-hidden="true" /></a></aside>
      </div>}
      <section className={styles.recommendations} aria-label="You may also like"><div className={styles.sectionHeading}><h2>You May Also Like</h2><a href="/shop">View All <ChevronRight aria-hidden="true" /></a></div><div className={styles.recommendationGrid}>{recommendations.map((product) => { const wished = wishes.includes(product.slug); return <article className={styles.card} key={product.slug}><div className={styles.cardImage}><a href={`/product/${product.slug}`}><img src={product.image} alt={product.name} /></a><button type="button" aria-label={`${wished ? 'Remove' : 'Add'} ${product.name} from wishlist`} onClick={() => setWishes((current) => wished ? current.filter((slug) => slug !== product.slug) : [...current, product.slug])}><Heart fill={wished ? 'currentColor' : 'none'} /></button></div><h3><a href={`/product/${product.slug}`}>{product.name}</a></h3><strong>{money(product.price)}</strong><button type="button" className={styles.cardAdd} aria-label={`Add ${product.name} to cart`} onClick={() => addRecommendation(product)}><ShoppingBag aria-hidden="true" /> Add to Cart</button></article>})}</div></section>
      {notice && <p className={styles.notice} role="status">{notice}</p>}
    </div>
    <SiteFooter />
  </main>
}

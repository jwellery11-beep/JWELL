'use client'

import { useMemo } from 'react'
import { ArrowLeft, Clock, Menu, Heart, ShoppingBag, UserRound } from 'lucide-react'
import SiteFooter from '../../components/site-footer'
import { money, products } from '../../lib/products'
import { useCart } from '../../lib/use-cart'
import styles from './confirmation.module.css'

const shipping = 99

export default function OrderConfirmationPage() {
  const { lines, count } = useCart()
  const items = lines.flatMap((line) => { const product = products.find((item) => item.slug === line.slug); return product ? [{ product, quantity: line.quantity }] : [] })
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items])
  const total = subtotal + (items.length ? shipping : 0)

  return <main className={styles.page}>
    <header className={styles.header}><button type="button" aria-label="Open menu"><Menu /></button><a href="/" aria-label="Miraaya Jewels home"><img src="/miralogo.png" alt="Miraaya Jewels" /></a><nav aria-label="Account actions"><a href="#account" aria-label="Account"><UserRound /></a><a href="#wishlist" aria-label="Wishlist"><Heart /></a><a href="/cart" aria-label={`${count} items in cart`} className={styles.cart}><ShoppingBag /><b>{count}</b></a></nav></header>
    <div className={styles.shell}>
      <section className={styles.confirmation} aria-labelledby="confirmation-title">
        <div className={styles.pendingIcon} aria-hidden="true"><Clock /></div>
        <h1 id="confirmation-title">Order Confirmation</h1>
        <p className={styles.lead}>Your order has not been placed yet.</p>
        <p className={styles.muted}>Payment gateway verification is required before an order can be confirmed.</p>
      </section>
      <section className={styles.card} aria-labelledby="summary-title"><h2 id="summary-title">Order Summary</h2><div className={styles.meta}><div><span>Order ID</span><strong>Created after payment</strong></div><div><span>Date</span><strong>Not available</strong></div><div><span>Total Amount</span><strong>{money(total)}</strong></div><div><span>Payment Status</span><strong className={styles.pending}>Pending</strong></div></div></section>
      <section className={styles.products} aria-labelledby="products-title"><h2 id="products-title">Items in Cart</h2>{items.length ? items.map(({ product, quantity }) => <article className={styles.item} key={product.slug}><img src={product.image} alt={product.name} /><div><h3>{product.name}</h3><p>{money(product.price)} × {quantity}</p></div><strong>{money(product.price * quantity)}</strong></article>) : <p className={styles.muted}>No cart items are available.</p>}</section>
      <div className={styles.actions}><a className={styles.primary} href="/cart">Return to Cart</a><a className={styles.secondary} href="/shop">Continue Shopping</a></div>
      <p className={styles.disclaimer}><ArrowLeft aria-hidden="true" /> This page will show a success confirmation only after a verified payment response.</p>
    </div>
    <SiteFooter />
  </main>
}

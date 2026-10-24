'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Heart, Menu, ShoppingBag, UserRound } from 'lucide-react'
import SiteFooter from '../../../components/site-footer'
import { money, products } from '../../../lib/products'
import styles from './payment.module.css'

type CartLine = { slug: string; quantity: number }
type CheckoutDetails = { name: string; mobile: string; email: string; address: string; city: string; state: string; pincode: string }
const cartKey = 'miraaya-cart-preview'
const detailsKey = 'miraaya-checkout-details'
const shippingCharge = 99

export default function PaymentPage() {
  const [lines, setLines] = useState<CartLine[]>([])
  const [details, setDetails] = useState<CheckoutDetails | null>(null)
  const [notice, setNotice] = useState('')
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    try {
      const savedLines = window.sessionStorage.getItem(cartKey)
      const savedDetails = window.sessionStorage.getItem(detailsKey)
      if (savedLines) setLines((JSON.parse(savedLines) as CartLine[]).filter((line) => line.quantity > 0 && products.some((product) => product.slug === line.slug)))
      if (savedDetails) setDetails(JSON.parse(savedDetails) as CheckoutDetails)
    } catch { /* session storage is optional in preview environments */ }
  }, [])

  const items = lines.flatMap((line) => { const product = products.find((item) => item.slug === line.slug); return product ? [{ product, quantity: line.quantity }] : [] })
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items])
  const total = subtotal + (items.length ? shippingCharge : 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const placeOrder = () => {
    if (!items.length) return setNotice('Your cart is empty. Please add an item before placing an order.')
    if (!details) return setNotice('Please complete Contact Information and Delivery Address first.')
    setPlacing(true)
    window.setTimeout(() => { setPlacing(false); setNotice('Payment gateway is not configured yet. No order was placed.') }, 450)
  }

  return <main className={styles.page}>
    <header className={styles.header}><button type="button" aria-label="Open menu"><Menu /></button><a href="/" aria-label="Miraaya Jewels home"><img src="/miralogo.png" alt="Miraaya Jewels" /></a><nav aria-label="Account actions"><a href="#account" aria-label="Account"><UserRound /></a><a href="#wishlist" aria-label="Wishlist"><Heart /></a><a className={styles.cart} href="/cart" aria-label={`${itemCount} items in cart`}><ShoppingBag /><b>{itemCount}</b></a></nav></header>
    <div className={styles.shell}>
      <a className={styles.back} href="/checkout"><ArrowLeft aria-hidden="true" /> Edit delivery details</a>
      <section aria-labelledby="summary-title"><h1 id="summary-title">3. Order Summary</h1>{!items.length ? <div className={styles.empty}><p>Your cart is empty.</p><a href="/shop">Continue Shopping</a></div> : <><div className={styles.items}>{items.map(({ product, quantity }) => <article className={styles.item} key={product.slug}><img src={product.image} alt={product.name} /><div><h2>{product.name}</h2><p>{money(product.price)} × {quantity}</p></div><strong>{money(product.price * quantity)}</strong></article>)}</div><div className={styles.totals}><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Shipping Charges</span><strong>{money(shippingCharge)}</strong></div><div className={styles.grand}><span>Total Amount</span><strong>{money(total)}</strong></div></div></>}</section>
      <section className={styles.payment} aria-labelledby="payment-title"><h1 id="payment-title">4. Payment Method</h1><div className={styles.option}><div className={styles.optionTitle}><span className={styles.radio} aria-hidden="true" /> <strong>Online Payment</strong></div><p>Secure and encrypted payment</p><div className={styles.paymentMarks} aria-label="Accepted payment methods"><span className={styles.upi}>UPI</span><span className={styles.visa}>VISA</span><span className={styles.mastercard} aria-label="Mastercard"><i /><i /></span><span className={styles.rupay}>RuPay</span></div><div className={styles.info}>You will be redirected to a secure payment page to complete the payment once a payment gateway is configured.</div></div><button className={styles.place} type="button" disabled={placing} onClick={placeOrder}>{placing ? 'Checking payment...' : 'Place Order'}</button>{notice && <p className={styles.notice} role="status">{notice}</p>}</section>
    </div>
    <SiteFooter />
  </main>
}

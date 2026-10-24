'use client'

import { useEffect, useState } from 'react'
import { Heart, Menu, ShoppingBag, UserRound, ChevronDown } from 'lucide-react'
import SiteFooter from '../../components/site-footer'
import styles from './checkout.module.css'

type FormData = { name: string; mobile: string; email: string; address: string; city: string; state: string; pincode: string }
type Errors = Partial<Record<keyof FormData, string>>
type CartLine = { slug: string; quantity: number }

const cartKey = 'miraaya-cart-preview'
const detailsKey = 'miraaya-checkout-details'
const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry']
const initial: FormData = { name: '', mobile: '', email: '', address: '', city: '', state: '', pincode: '' }

export default function CheckoutPage() {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(cartKey)
      const savedDetails = window.sessionStorage.getItem(detailsKey)
      if (saved) setCartCount((JSON.parse(saved) as CartLine[]).reduce((sum, line) => sum + line.quantity, 0))
      if (savedDetails) setForm(JSON.parse(savedDetails) as FormData)
    } catch { /* session storage is optional in preview environments */ }
  }, [])

  const update = (field: keyof FormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const next: Errors = {}
    if (!form.name.trim() || form.name.trim().length < 2) next.name = 'Please enter your full name.'
    if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/\D/g, ''))) next.mobile = 'Enter a valid 10-digit mobile number.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.address.trim()) next.address = 'Please enter your address.'
    if (!form.city.trim()) next.city = 'Please enter your city.'
    if (!form.state) next.state = 'Please select your state.'
    if (!/^\d{6}$/.test(form.pincode)) next.pincode = 'Enter a valid 6-digit pincode.'
    setErrors(next)
    setSubmitted(true)
    if (!Object.keys(next).length) window.sessionStorage.setItem(detailsKey, JSON.stringify(form))
    return Object.keys(next).length === 0
  }

  const field = (key: keyof FormData, label: string, placeholder: string, type = 'text', autocomplete?: string) => <div className={`${styles.field} ${errors[key] ? styles.invalid : ''}`}><label htmlFor={key}>{label} <span aria-hidden="true">*</span></label><input id={key} name={key} type={type} value={form[key]} onChange={(event) => update(key, event.target.value)} placeholder={placeholder} autoComplete={autocomplete} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${key}-error` : undefined} />{errors[key] && <p id={`${key}-error`} className={styles.error}>{errors[key]}</p>}</div>

  return <main className={styles.page}>
    <header className={styles.header}><button type="button" aria-label="Open menu"><Menu /></button><a href="/" aria-label="Miraaya Jewels home"><img src="/miralogo.png" alt="Miraaya Jewels" /></a><nav aria-label="Account actions"><a href="#account" aria-label="Account"><UserRound /></a><a href="#wishlist" aria-label="Wishlist"><Heart /></a><a href="/cart" aria-label={`${cartCount} items in cart`} className={styles.cart}><ShoppingBag /><b>{cartCount}</b></a></nav></header>
    <div className={styles.shell}><h1>Checkout</h1><form onSubmit={(event) => { event.preventDefault(); validate() }} noValidate>
      <section><h2>1. Contact Information</h2>{field('name', 'Full Name', 'Enter your full name', 'text', 'name')}{field('mobile', 'Mobile Number', 'Enter mobile number', 'tel', 'tel')}{field('email', 'Email Address', 'Enter your email address', 'email', 'email')}</section>
      <section><h2>2. Delivery Address</h2>{field('address', 'Address', 'House no, Building, Street', 'text', 'street-address')}<div className={styles.twoColumns}>{field('city', 'City', 'Enter city', 'text', 'address-level2')}<div className={`${styles.field} ${errors.state ? styles.invalid : ''}`}><label htmlFor="state">State <span aria-hidden="true">*</span></label><div className={styles.selectWrap}><select id="state" name="state" value={form.state} onChange={(event) => update('state', event.target.value)} autoComplete="address-level1" aria-invalid={Boolean(errors.state)}><option value="">Select State</option>{states.map((state) => <option key={state} value={state}>{state}</option>)}</select><ChevronDown aria-hidden="true" /></div>{errors.state && <p className={styles.error}>{errors.state}</p>}</div></div>{field('pincode', 'Pincode', 'Enter 6-digit pincode', 'text', 'postal-code')}</section>
      <button className={styles.submit} type="submit">Continue to Payment</button>{submitted && Object.keys(errors).length === 0 && <p className={styles.success} role="status">Details saved. <a href="/checkout/payment">Continue to payment</a>.</p>}
    </form>    </div>
    <SiteFooter />
  </main>
}

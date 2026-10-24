'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Heart, Menu, Search, ShoppingBag, UserRound, X, Truck, ShieldCheck, Headphones, Gem, Star, Gift, Plus, Minus } from 'lucide-react'
import SiteFooter from '../components/site-footer'

const categories = [
  ['Necklaces', '/category-necklaces.png'],
  ['Rings', '/category-rings.png'],
  ['Bangles', '/category-bangles.png'],
  ['Earrings', '/category-earrings.png'],
  ['Hair Accessories', '/category-hair.png'],
  ['Maang Tikka', '/category-tikka.png'],
  ['Watches', '/category-watches.png'],
] as const
const categoryNames = categories.map(([name]) => name)
const bestsellers = [
  ['Crystal Drop Earrings', '₹1,499', '₹1,999', '25% off', 'Bestseller', '/product-earrings.png', '4.8', '120'],
  ['Kundan Necklace Set', '₹2,299', '₹2,999', '23% off', '', '/product-necklace.png', '4.7', '96'],
  ['Rose Gold Ring', '₹1,199', '₹1,699', '29% off', 'New', '/product-ring.png', '4.6', '72'],
  ['Elegant Bangles Set', '₹1,799', '₹2,299', '22% off', '', '/product-bangles.png', '4.8', '102'],
]
const arrivals = [
  ['Floral Hair Clip Set', '₹799', '₹1,099', '27% off', 'New', '/arrival-hair.png', '4.6', '64'],
  ['Minimal Watch', '₹2,499', '₹3,199', '22% off', 'New', '/arrival-watch.png', '4.5', '48'],
  ['Ruby Necklace Set', '₹2,299', '₹2,999', '22% off', 'New', '/arrival-ruby.png', '4.7', '72'],
  ['Stone Earrings', '₹1,299', '₹1,799', '28% off', 'New', '/arrival-earrings.png', '4.6', '58'],
  ]
const faqs = [
  ['What material is the jewellery made of?', 'Miraaya Jewels offers artificial and fashion jewellery. Refer to the individual product description for the material and finish of each piece.'],
  ['How can I track my order?', "Customers can contact the store's support team or use the website's Track Order page with the required order details. The store will provide tracking information when it becomes available."],
  ['What are the delivery charges and time?', 'Delivery is free on purchases above ₹2,000. A ₹100 delivery charge applies to purchases below ₹2,000. Expected delivery time is 5–7 days.'],
  ['Is Cash on Delivery available?', 'No. Online payment is accepted through the configured Razorpay payment flow. Cash on Delivery is not available.'],
  ['What is your return or exchange policy?', 'Returns or exchanges may be considered when the delivered parcel contains a damaged or incorrect product. Customers must record an unboxing video showing the parcel opening and the issue. The store will review the evidence and confirm the next steps according to its policy.'],
]

function ProductCard({ item, onAdd, onWish, wished }: { item: string[]; onAdd: () => void; onWish: () => void; wished: boolean }) {
  return <article className="product-card"><div className="product-photo"><img src={item[5] || '/miraaya-products.png'} alt={item[0]} /><span className={`product-badge ${item[4] === 'New' ? 'new-badge' : ''}`}>{item[4]}</span><button className={`heart ${wished ? 'active' : ''}`} aria-label={`Wishlist ${item[0]}`} onClick={onWish}><Heart fill={wished ? 'currentColor' : 'none'} /></button></div><div className="product-details"><h3>{item[0]}</h3><div className="price-row"><strong>{item[1]}</strong> <del>{item[2]}</del> <b>{item[3]}</b></div><p className="rating" aria-label={`${item[6] || '4.8'} out of 5 stars, ${item[7] || '120'} reviews`}><span className="stars" aria-hidden="true"><Star /><Star /><Star /><Star /><Star /></span> <span>{item[6] || '4.8'} ({item[7] || '120'})</span></p><button className="cart-button" onClick={onAdd}><ShoppingBag /> Add to Cart</button></div></article>
}

export default function Page() {
  const [cart, setCart] = useState(2)
  const [wishes, setWishes] = useState<number[]>([])
  const [menu, setMenu] = useState(false)
  const [faq, setFaq] = useState<number | null>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [toast, setToast] = useState('')
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    try { setAnnouncementVisible(sessionStorage.getItem('miraaya-announcement-dismissed') !== '1') } catch {}
    document.body.style.overflow = menu ? 'hidden' : ''
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(false) }
    window.addEventListener('keydown', onKeyDown)
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKeyDown); document.body.style.overflow = '' }
  }, [menu])
  const closeAnnouncement = () => { setAnnouncementVisible(false); try { sessionStorage.setItem('miraaya-announcement-dismissed', '1') } catch {} }
  const add = (name: string) => { setCart((n) => n + 1); setToast(`${name} added to cart`); window.setTimeout(() => setToast(''), 2200) }
  const toggleWish = (i: number) => setWishes((w) => w.includes(i) ? w.filter((x) => x !== i) : [...w, i])

  return <main id="top">
    {announcementVisible && <div className="announcement" aria-label="Shipping information"><div className="announcement-viewport"><div className="announcement-track"><span className="announcement-item"><Truck aria-hidden="true" />Free shipping on orders above ₹2,000</span><i aria-hidden="true" /><span className="announcement-item"><Truck aria-hidden="true" />₹100 shipping charge below ₹2,000</span><span className="announcement-delivery">Delivery in 5–7 days</span><span className="announcement-item"><Truck aria-hidden="true" />Free shipping on orders above ₹2,000</span><i aria-hidden="true" /><span className="announcement-item"><Truck aria-hidden="true" />₹100 shipping charge below ₹2,000</span><span className="announcement-delivery">Delivery in 5–7 days</span></div></div><button className="announcement-close" aria-label="Close announcement" onClick={closeAnnouncement}>×</button></div>}
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}><div className="header-inner"><div className="header-row"><div className="header-side header-left"><button className="menu-button" aria-label="Open menu" onClick={() => setMenu(true)}><Menu /></button><a className="logo" href="#top" aria-label="Miraaya Jewels home"><img src="/miralogo.png" alt="Miraaya Jewels" /></a></div><nav className="primary-nav" aria-label="Primary navigation"><a href="#top">Home</a><a href="#shop">Shop</a><a href="#category">Categories</a><a href="#occasion">Collections</a></nav><div className="actions header-side header-right"><button aria-label="Search"><Search /></button><button className="account" aria-label="Account"><UserRound /></button><button className="wish-header" aria-label="Wishlist"><Heart /><b>0</b></button><button aria-label="Shopping cart"><ShoppingBag /><b>{cart}</b></button></div></div><div className="search-row"><label className="search-bar"><Search aria-hidden="true" /><input aria-label="Search jewellery" placeholder="Search for necklaces, earrings, rings, bangles…" /></label></div></div></header>
    {menu && <div className="drawer-backdrop" role="presentation" onClick={() => setMenu(false)}><aside className="drawer" role="dialog" aria-modal="true" aria-label="Miraaya Jewels menu" onClick={(e) => e.stopPropagation()}><button className="drawer-close" aria-label="Close menu" onClick={() => setMenu(false)}><X /></button><div className="drawer-brand"><img src="/miralogo.png" alt="Miraaya Jewels" /></div><nav className="drawer-categories" aria-label="Jewellery categories">{categoryNames.map((c) => <a key={c} href="#shop" onClick={() => setMenu(false)}><span className="drawer-category-icon" aria-hidden="true"><Gem /></span><span>{c}</span><ArrowRight /></a>)}</nav><nav className="drawer-utilities" aria-label="Account links"><a href="#top" onClick={() => setMenu(false)}><UserRound /><span>My Account</span><ArrowRight /></a><a href="#shop" onClick={() => setMenu(false)}><Heart /><span>Wishlist</span><ArrowRight /></a><a href="#shop" onClick={() => setMenu(false)}><ShoppingBag /><span>Track Order</span><ArrowRight /></a><a href="#faq" onClick={() => setMenu(false)}><Headphones /><span>Help &amp; Support</span><ArrowRight /></a></nav></aside></div>}

    <section className="hero"><div className="hero-overlay"><p>MIRAAYA JEWELS</p><h1>Timeless<br />Elegance</h1><h3>Jewellery for Every Chapter<br />of You</h3><a className="gold-button" href="#shop">Shop Collection <ArrowRight /></a><div className="dots">● ● ● ●</div></div></section>
    <div className="service-strip"><div><Gem /><span>Premium<br />Quality</span></div><div><ShieldCheck /><span>Secure<br />Payments</span></div><div><Truck /><span>5–7 Days<br />Delivery</span></div><div><Headphones /><span>Support<br />9 AM – 9 PM</span></div></div>

    <section className="reference-section" id="category"><SectionTitle title="Shop by Category" /><div className="category-row" aria-label="Jewellery categories">{categories.map(([name, image]) => <a href="#shop" className="category" key={name} aria-label={`Shop ${name}`}><div className="category-image"><img src={image} alt="" /></div><strong>{name}</strong><span aria-hidden="true">→</span></a>)}</div><div className="collection-banners"><a className="banner bridal" href="#occasion"><strong>Wedding &amp; Bridal</strong><small>Make your special day<br />even more memorable.</small><em>Explore Collection →</em></a><a className="banner festive" href="#occasion"><strong>Festive Wear</strong><small>Shine brighter<br />this festive season.</small><em>Shop Now →</em></a></div></section>

    <section className="reference-section products" id="shop"><SectionTitle title="Our Bestsellers" /><div className="product-grid">{bestsellers.map((p, i) => <ProductCard key={p[0]} item={p} wished={wishes.includes(i)} onWish={() => toggleWish(i)} onAdd={() => add(p[0])} />)}</div></section>
    <section className="reference-section occasion" id="occasion"><div className="occasion-heading"><h2>Jewellery for Every Occasion</h2><a href="#shop">View All →</a></div><div className="occasion-grid"><a href="#shop" className="occasion-card bridal-card"><div className="occasion-copy"><strong>Wedding &amp; Bridal</strong><b>Collection</b><small>Make your special day<br />even more memorable.</small><em>Explore Collection →</em></div></a><a href="#shop" className="occasion-card festive-card"><div className="occasion-copy"><strong>Festive Wear</strong><small>Shine brighter<br />this festive season.</small><em>Shop Now →</em></div></a></div></section>
    <section className="reference-section products"><SectionTitle title="New Arrivals" /><div className="product-grid">{arrivals.map((p, i) => <ProductCard key={p[0]} item={p} wished={wishes.includes(i + 4)} onWish={() => toggleWish(i + 4)} onAdd={() => add(p[0])} />)}</div></section>

    <section className="story"><div className="story-image" /><div className="story-copy"><h2>More Than Jewellery</h2><p>At MIRAAYA JEWELS, we create pieces that celebrate your unique style. Our collections blend modern elegance with timeless beauty, crafted with care for every special moment.</p><div className="story-benefits"><span><Gem /><small>Thoughtful<br />Designs</small></span><span><ShieldCheck /><small>Premium<br />Quality</small></span><span><Gift /><small>Careful<br />Packaging</small></span><span><Truck /><small>Reliable<br />Delivery</small></span></div><a className="gold-button" href="#faq">Our Story <ArrowRight /></a></div></section>
    <section className="reference-section reviews"><div className="reviews-heading"><h2>Loved by Our Customers</h2><a href="#shop">View All <ArrowRight aria-hidden="true" /></a></div><div className="review-grid"><Review name="Priya S." text="Absolutely loved the quality! The design is so elegant and exactly like the pictures." /><Review name="Neha K." text="Beautiful collection and fast delivery. The jewellery looks premium and perfect for special occasions." /><Review name="Ritika M." text="Great experience! Packaging was amazing and the product was just as shown." /></div></section>
    <section className="reference-section faq" id="faq"><div className="faq-heading"><h2>Frequently Asked Questions</h2><a href="#faq-list">View All <ArrowRight aria-hidden="true" /></a></div><div className="faq-grid" id="faq-list">{faqs.map(([q, a], i) => { const open = faq === i; const answerId = `faq-answer-${i}`; return <div className={`faq-item${open ? ' is-open' : ''}`} key={q}><button className="faq-trigger" onClick={() => setFaq(open ? null : i)} aria-expanded={open} aria-controls={answerId}><span>{q}</span>{open ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}</button>{open && <p id={answerId}>{a}</p>}</div> })}</div></section>
    <section className="newsletter"><div className="newsletter-image" /><div><h2>Be the First to Know</h2><p>Get updates on new collections, exclusive offers and more.</p></div><form onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setSubscribed(true) }}>{subscribed ? <strong>Thank you — you&apos;re on the list.</strong> : <><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Enter your email address" aria-label="Email address" /><button>Subscribe <ArrowRight /></button></>}</form></section>
    <SiteFooter />
    {toast && <div className="toast" role="status">{toast}</div>}
  </main>
}
function SectionTitle({ title }: { title: string }) { return <div className="section-title"><h2>{title}</h2><a href="#shop">View All →</a></div> }
function Review({ name, text }: { name: string; text: string }) { return <article className="review"><div className="avatar" aria-hidden="true">{name.charAt(0)}</div><div className="review-content"><strong>{name}</strong><p className="stars" aria-label="5 out of 5 stars">★★★★★</p><p>{text}</p></div></article> }

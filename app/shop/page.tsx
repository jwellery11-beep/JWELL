'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Grid2x2X as Grid2X2, Heart, List, Menu, Search, ShoppingBag, SlidersHorizontal } from 'lucide-react'
import styles from './shop.module.css'
import SiteFooter from '../../components/site-footer'
import { money, products, type Product } from '../../lib/products'
import { addToCart as addToCartStore } from '../../lib/cart'
import { useCartCount } from '../../lib/use-cart-count'

const categories = ['All Jewellery', 'Necklaces', 'Earrings', 'Rings', 'Bangles', 'Hair Accessories', 'Watches']

function ProductCard({ product, onCart }: { product: Product; onCart: () => void }) {
  const [wished, setWished] = useState(false)
  const discount = Math.round((1 - product.price / product.original) * 100)
  return <article className={styles.card}>
    <div className={styles.photo}><img src={product.image} alt={product.name} /><button className={`${styles.wishlist} ${wished ? styles.active : ''}`} aria-label={`Add ${product.name} to wishlist`} onClick={() => setWished(!wished)}><Heart fill={wished ? 'currentColor' : 'none'} /></button></div>
    <div className={styles.details}><h2><a href={`/product/${product.slug}`}>{product.name}</a></h2><div className={styles.price}><strong>{money(product.price)}</strong><del>{money(product.original)}</del></div><b className={styles.discount}>{discount}% off</b><p className={styles.rating}><span aria-hidden="true">★★★★★</span><span>{product.rating} ({product.reviews})</span></p><button className={styles.cart} onClick={onCart}><ShoppingBag /> Add to Cart</button></div>
  </article>
}

export default function ShopPage() {
  const [category, setCategory] = useState('Earrings')
  const [appliedCategories, setAppliedCategories] = useState<string[]>(['Earrings'])
  const [price, setPrice] = useState('all')
  const [sort, setSort] = useState('popularity')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [mobileFilters, setMobileFilters] = useState(false)
  const [mobileSort, setMobileSort] = useState(false)
  const [draftCategory, setDraftCategory] = useState(category)
  const [draftCategories, setDraftCategories] = useState<string[]>(category === 'All Jewellery' ? [] : [category])
  const [draftPrice, setDraftPrice] = useState(price)
  const [draftSort, setDraftSort] = useState(sort)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const cartCount = useCartCount()
  const shown = useMemo(() => products.filter((product) => {
    const categoryMatch = category === 'All Jewellery' || appliedCategories.length === 0 || appliedCategories.includes(product.category)
    const priceMatch = price === 'all' || (price === 'under-1000' ? product.price < 1000 : price === '1000-2000' ? product.price >= 1000 && product.price <= 2000 : price === '2000-5000' ? product.price > 2000 && product.price <= 5000 : price === 'over-5000' ? product.price > 5000 : price === 'under-1500' ? product.price < 1500 : price === '1500-2500' ? product.price >= 1500 && product.price <= 2500 : product.price > 2500)
    const searchMatch = !query.trim() || product.name.toLowerCase().includes(query.trim().toLowerCase()) || product.category.toLowerCase().includes(query.trim().toLowerCase())
    return categoryMatch && priceMatch && searchMatch
  }).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0), [category, price, sort, query])
  const applyFilters = () => { setAppliedCategories(draftCategories); setCategory(draftCategories.length ? draftCategories[0] : 'All Jewellery'); setPrice(draftPrice); setMobileFilters(false) }
  const clearFilters = () => { setDraftCategory('All Jewellery'); setDraftCategories([]); setDraftPrice('all'); setAppliedCategories([]); setCategory('All Jewellery'); setPrice('all'); setMobileFilters(false) }
  const closeFilters = () => { setDraftCategories(category === 'All Jewellery' ? [] : [category]); setDraftPrice(price); setMobileFilters(false) }
  const applySort = () => { setSort(draftSort); setMobileSort(false) }
  const closeSort = () => { setDraftSort(sort); setMobileSort(false) }
  const toggleDraftCategory = (item: string) => setDraftCategories((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])
  const addToCart = (product: Product) => { addToCartStore(product.slug); setNotice(`${product.name} added to cart`); window.setTimeout(() => setNotice(''), 2200) }

  return <main className={styles.page}>
    <header className={styles.header}><div className={styles.headerRow}><button className={styles.menu} aria-label="Open menu"><Menu /></button><a href="/" className={styles.logo}><img src="/miralogo.png" alt="Miraaya Jewels home" /></a><nav><a href="/">Home</a><a className={styles.current} href="/shop">Shop</a><a href="/#category">Categories</a><a href="/#occasion">Collections</a></nav><div className={styles.actions}><button aria-label="Search"><Search /></button><button aria-label="Wishlist"><Heart /></button><button aria-label="Shopping cart"><ShoppingBag /><b>{cartCount}</b></button></div></div><label className={styles.search}><Search /><input aria-label="Search jewellery" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for necklaces, earrings, rings, bangles…" /></label></header>
    <section className={styles.hero}><div><h1>Earrings</h1><p>Explore our exquisite collection<br />of earrings for every occasion.</p></div></section>
    <div className={styles.breadcrumb}><a href="/">Home</a><span>›</span><strong>Earrings</strong></div>
    <section className={styles.content}><div className={styles.toolbarTop}><button className={styles.mobileFilter} onClick={() => { setDraftCategories(category === 'All Jewellery' ? [] : [category]); setDraftPrice(price); setMobileFilters(true) }}><SlidersHorizontal /> Filters</button><button className={styles.sortMobile} onClick={() => { setDraftSort(sort); setMobileSort(true) }}>Sort By <span>{sort === 'low' ? 'Price: Low to High' : sort === 'high' ? 'Price: High to Low' : 'Popularity'}</span><ChevronDown /></button></div>
      <div className={styles.toolbar}><div className={styles.filterGroup}><span>Category</span><div className={styles.pills}>{categories.map((item) => <button key={item} className={draftCategory === item ? styles.selected : ''} onClick={() => { setDraftCategory(item); setDraftCategories(item === 'All Jewellery' ? [] : [item]); setAppliedCategories(item === 'All Jewellery' ? [] : [item]); setCategory(item) }}>{item}</button>)}</div></div><label className={styles.priceFilter}>Price <select value={draftPrice} onChange={(e) => { setDraftPrice(e.target.value); setPrice(e.target.value) }}><option value="all">All prices</option><option value="under-1500">Under ₹1,500</option><option value="1500-2500">₹1,500 – ₹2,500</option><option value="over-2500">Over ₹2,500</option></select><ChevronDown /></label></div>
      <div className={`${styles.drawer} ${mobileFilters ? styles.drawerOpen : ''}`} role="dialog" aria-modal="true" aria-labelledby="filters-title"><div className={styles.drawerHeader}><h2 id="filters-title">Filters</h2><button aria-label="Close filters" onClick={closeFilters}>×</button></div><div className={styles.drawerBody}><fieldset><legend>Category</legend>{['Necklaces','Rings','Bangles','Earrings','Hair Accessories','Maang Tikka','Watches'].map((item) => <label key={item}><input type="checkbox" checked={draftCategories.includes(item)} onChange={() => toggleDraftCategory(item)} /> <span>{item}</span></label>)}</fieldset><fieldset><legend>Price Range</legend>{[['under-1000','Under ₹1,000'],['1000-2000','₹1,000 – ₹2,000'],['2000-5000','₹2,000 – ₹5,000'],['over-5000','Above ₹5,000']].map(([value,label]) => <label key={value}><input type="radio" name="mobile-price" checked={draftPrice === value} onChange={() => setDraftPrice(value)} /> <span>{label}</span></label>)}</fieldset></div><div className={styles.drawerActions}><button onClick={clearFilters}>Clear All</button><button onClick={applyFilters}>Apply</button></div></div>
      <div className={`${styles.drawer} ${styles.sortDrawer} ${mobileSort ? styles.drawerOpen : ''}`} role="dialog" aria-modal="true" aria-labelledby="sort-title"><div className={styles.drawerHeader}><h2 id="sort-title">Sort By</h2><button aria-label="Close sort" onClick={closeSort}>×</button></div><div className={styles.drawerBody}><fieldset>{[['popularity','Popularity'],['low','Price: Low to High'],['high','Price: High to Low']].map(([value,label]) => <label key={value}><input type="radio" name="mobile-sort" checked={draftSort === value} onChange={() => { setDraftSort(value); setSort(value) }} /> <span>{label}</span></label>)}</fieldset></div><div className={styles.drawerActions}><button onClick={applySort}>Apply</button></div></div>
      <div className={styles.controls}><span>{notice || `${shown.length * 30 || 0} Products`}</span><div><label>Sort By <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="popularity">Popularity</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option></select><ChevronDown /></label><button className={view === 'grid' ? styles.activeView : ''} aria-label="Grid view" onClick={() => setView('grid')}><Grid2X2 /></button><button className={view === 'list' ? styles.activeView : ''} aria-label="List view" onClick={() => setView('list')}><List /></button></div></div>
      <div className={`${styles.grid} ${view === 'list' ? styles.list : ''}`}>{shown.map((product) => <ProductCard key={product.name} product={product} onCart={() => addToCart(product)} />)}</div>
    </section>
    <SiteFooter />
  </main>
}

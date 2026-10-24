export type Product = { name: string; slug: string; category: string; price: number; original: number; image: string; gallery: string[]; rating: number; reviews: number }

export const products: Product[] = [
  { name: 'Crystal Drop Earrings', slug: 'crystal-drop-earrings', category: 'Earrings', price: 1499, original: 1999, image: '/product-earrings.png', gallery: ['/product-earrings.png', '/category-earrings.png', '/arrival-earrings.png', '/arrival-ruby.png'], rating: 4.8, reviews: 120 },
  { name: 'Pearl Stud Earrings', slug: 'pearl-stud-earrings', category: 'Earrings', price: 899, original: 1299, image: '/category-earrings.png', gallery: ['/category-earrings.png', '/product-earrings.png'], rating: 4.6, reviews: 85 },
  { name: 'Kundan Jhumka Earrings', slug: 'kundan-jhumka-earrings', category: 'Earrings', price: 1999, original: 2499, image: '/arrival-earrings.png', gallery: ['/arrival-earrings.png', '/product-earrings.png'], rating: 4.8, reviews: 62 },
  { name: 'Stone Drop Earrings', slug: 'stone-drop-earrings', category: 'Earrings', price: 1699, original: 2199, image: '/arrival-ruby.png', gallery: ['/arrival-ruby.png', '/product-earrings.png'], rating: 4.6, reviews: 54 },
  { name: 'Kundan Necklace Set', slug: 'kundan-necklace-set', category: 'Necklaces', price: 2299, original: 2999, image: '/product-necklace.png', gallery: ['/product-necklace.png'], rating: 4.7, reviews: 96 },
  { name: 'Rose Gold Ring', slug: 'rose-gold-ring', category: 'Rings', price: 1199, original: 1699, image: '/product-ring.png', gallery: ['/product-ring.png'], rating: 4.6, reviews: 72 },
  { name: 'Elegant Bangles Set', slug: 'elegant-bangles-set', category: 'Bangles', price: 1799, original: 2299, image: '/product-bangles.png', gallery: ['/product-bangles.png'], rating: 4.8, reviews: 102 },
  { name: 'Floral Hair Clip Set', slug: 'floral-hair-clip-set', category: 'Hair Accessories', price: 799, original: 1099, image: '/arrival-hair.png', gallery: ['/arrival-hair.png'], rating: 4.6, reviews: 64 },
]

export const money = (value: number) => `₹${value.toLocaleString('en-IN')}`
export const getProduct = (slug: string) => products.find((product) => product.slug === slug)

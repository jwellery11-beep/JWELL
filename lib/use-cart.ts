'use client'

import { useCallback, useEffect, useState } from 'react'
import { CART_KEY, CART_EVENT, cartCount, readCart, writeCart, type CartLine } from './cart'

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setLines(readCart())
    setHydrated(true)

    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_KEY) setLines(readCart())
    }
    const onCustom = () => setLines(readCart())

    window.addEventListener('storage', onStorage)
    window.addEventListener(CART_EVENT, onCustom)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(CART_EVENT, onCustom)
    }
  }, [])

  const addToCart = useCallback((slug: string, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.slug === slug)
      const next = existing
        ? current.map((line) => (line.slug === slug ? { ...line, quantity: line.quantity + quantity } : line))
        : [...current, { slug, quantity }]
      writeCart(next)
      window.dispatchEvent(new Event(CART_EVENT))
      return next
    })
  }, [])

  const removeFromCart = useCallback((slug: string) => {
    setLines((current) => {
      const next = current.filter((line) => line.slug !== slug)
      writeCart(next)
      window.dispatchEvent(new Event(CART_EVENT))
      return next
    })
  }, [])

  const updateQuantity = useCallback((slug: string, amount: number) => {
    setLines((current) => {
      const next = current.map((line) =>
        line.slug === slug ? { ...line, quantity: Math.max(1, line.quantity + amount) } : line,
      )
      writeCart(next)
      window.dispatchEvent(new Event(CART_EVENT))
      return next
    })
  }, [])

  const setLinesDirect = useCallback((next: CartLine[]) => {
    writeCart(next)
    setLines(next)
    window.dispatchEvent(new Event(CART_EVENT))
  }, [])

  return {
    lines,
    count: cartCount(lines),
    hydrated,
    addToCart,
    removeFromCart,
    updateQuantity,
    setLines: setLinesDirect,
  }
}

'use client'

import { useEffect, useState } from 'react'
import { CART_KEY, CART_EVENT, cartCount, readCart } from './cart'

export function useCartCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const sync = () => setCount(cartCount(readCart()))
    sync()

    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_KEY) sync()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener(CART_EVENT, sync)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(CART_EVENT, sync)
    }
  }, [])

  return count
}

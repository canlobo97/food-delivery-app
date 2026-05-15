import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../types/product'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchProducts = async () => {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from('products')
          .select('*')

        if (error) {
          console.error(error)
          return
        }

        if (mounted) {
          setProducts(data || [])
        }
      } catch (err) {
        console.error('Products fetch error:', err)

        if (mounted) {
          setProducts([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    // 🔥 refetch quando torni nella PWA
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchProducts()
      }
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibility
    )

    return () => {
      mounted = false

      document.removeEventListener(
        'visibilitychange',
        handleVisibility
      )
    }
  }, [])

  return {
    products,
    loading
  }
}
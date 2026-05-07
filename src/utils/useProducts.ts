import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../types/product'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) console.error(error)
      else setProducts(data || [])

      setLoading(false)
    }

    fetchProducts()
  }, [])

  return { products, loading }
}
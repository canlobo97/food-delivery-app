import { Container, Typography, Box } from '@mui/material'
import ProductCard from '../components/product/ProductCard'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Product = {
  id: number
  name: string
  description?: string
  price: number
  image: string
}

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  console.log(products)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) {
        console.error(error)
      } else {
        setProducts(data)
      }

      setLoading(false)
    }

    fetchProducts()
  }, [])

  return (
    <Container sx={{ mt: 4, pb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Menu 🍕
      </Typography>

      {/* 🔄 LOADING */}
      {loading ? (
        <Typography>Caricamento...</Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3
          }}
        >
          {products.map((product) => (
            <Box
              key={product.id}
              sx={{
                width: {
                  xs: '100%',
                  sm: 'calc(50% - 12px)',
                  md: 'calc(33.33% - 16px)'
                }
              }}
            >
              <ProductCard
                product={{
                  ...product,
                  image: product.image // 🔥 mapping
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  )
}
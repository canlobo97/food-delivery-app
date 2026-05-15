import {
  Typography,
  Box,
  Tabs,
  Tab
} from '@mui/material'

import {
  useMemo,
  useRef,
  useState
} from 'react'

import ProductCard from '../components/product/ProductCard'

import { useProducts } from '../utils/useProducts'
import type { Product } from '../types/product'

export default function Menu() {
  const { products, loading } = useProducts()

  const [tab, setTab] = useState(0)

  const categoryRefs = useRef<
    Record<string, HTMLDivElement | null>
  >({})

  // GROUP PRODUCTS
  const grouped = useMemo(() => {
    return products.reduce(
      (acc: Record<string, Product[]>, product) => {
        const category = product.category || 'Altro'

        if (!acc[category]) {
          acc[category] = []
        }

        acc[category].push(product)

        return acc
      },
      {}
    )
  }, [products])

  const categories = Object.keys(grouped)

  const handleTabChange = (
    _: React.SyntheticEvent,
    value: number
  ) => {
    setTab(value)

    const category = categories[value]

    const el = categoryRefs.current[category]

    if (!el) return

    const y =
      el.getBoundingClientRect().top +
      window.scrollY -
      12

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    })
  }

  return (
    <Box
      sx={{
        width: '100%',
        pb: {
          xs: 14,
          md: 4
        }
      }}
    >
      {/* CATEGORY BAR */}
      <Box
        sx={{
          top: 0,
          zIndex: 1000,
          pb: 1,
          background: 'rgba(0,0,0,0.92)',

          borderBottom:
            '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            minHeight: 55,

            '& .MuiTabs-indicator': {
              background:
                'linear-gradient(45deg,#ff416c,#ff4b2b)',
              height: 3,
              borderRadius: 999
            },

            '& .MuiTab-root': {
              color: '#fff',
              textTransform: 'none',
              fontWeight: 700,
              minHeight: 55
            },

            '& .Mui-selected': {
              color: '#ff4b2b !important'
            }
          }}
        >
          {categories.map((category) => (
            <Tab
              key={category}
              label={category}
            />
          ))}
        </Tabs>
      </Box>

      {/* CONTENT */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto'
        }}
      >
        {loading ? (
          <Typography sx={{ mt: 2 }}>
            Caricamento...
          </Typography>
        ) : (
          categories.map((category) => (
            <Box
              key={category}
              ref={(el: HTMLDivElement | null) => { categoryRefs.current[category] = el }}
              sx={{
                mt: 3,
                px: 1
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  color: '#fff'
                }}
              >
                {category.toUpperCase()}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2
                }}
              >
                {grouped[category].map(
                  (product: Product) => (
                    <Box
                      key={product.id}
                      sx={{
                        width: {
                          xs: '100%',
                          sm: 'calc(50% - 8px)',
                          md: 'calc(33.33% - 12px)'
                        }
                      }}
                    >
                      <ProductCard
                        product={product}
                      />
                    </Box>
                  )
                )}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}
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
import { colors } from '../theme/colors'

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

  // Logica categorie invariata — solo stile aggiornato
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
        minHeight: '100dvh',
        bgcolor: colors.bg,
        fontFamily: '"Outfit", system-ui, sans-serif',
        pb: {
          xs: 14,
          md: 4
        }
      }}
    >
      {/* CATEGORY BAR — stessa logica Tabs, look app-native */}
      <Box
        sx={{
          top: 0,
          zIndex: 1000,
          bgcolor: colors.surface,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            minHeight: 48,
            px: 0.5,

            '& .MuiTabs-indicator': {
              backgroundColor: colors.accent,
              height: 3,
              borderRadius: 999
            },

            '& .MuiTab-root': {
              color: colors.muted,
              textTransform: 'none',
              fontWeight: 700,
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              minHeight: 48,
              minWidth: 'auto',
              px: 2,
            },

            '& .Mui-selected': {
              color: `${colors.accent} !important`
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
          mx: 'auto',
          px: { xs: 1.5, md: 2 },
        }}
      >
        {loading ? (
          <Typography
            sx={{
              mt: 4,
              color: colors.muted,
              textAlign: 'center',
              fontFamily: 'inherit',
            }}
          >
            Caricamento menu...
          </Typography>
        ) : (
          categories.map((category) => (
            <Box
              key={category}
              ref={(el: HTMLDivElement | null) => { categoryRefs.current[category] = el }}
              sx={{
                mt: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 1.5,
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  color: colors.ink,
                  fontFamily: 'inherit',
                }}
              >
                {category}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.5
                }}
              >
                {grouped[category].map(
                  (product: Product) => (
                    <Box
                      key={product.id}
                      sx={{
                        width: {
                          xs: '100%',
                          sm: 'calc(50% - 6px)',
                          md: 'calc(33.33% - 10px)'
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

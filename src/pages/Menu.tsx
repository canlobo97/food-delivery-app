import {
  Typography,
  Box
} from '@mui/material'

import { useEffect, useRef, useState } from 'react'

import ProductCard from '../components/product/ProductCard'
import CategoryTabs from '../components/menu/CategoryTabs'

import { useProducts } from '../utils/useProducts'
import type { Product } from '../types/product'

// 🔥 altezza navbar
const NAVBAR_HEIGHT = {
  mobile: 56,
  desktop: 64
}

export default function Menu() {
  const { products, loading } = useProducts()

  const [activeCategory, setActiveCategory] = useState('')

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const tabsRef = useRef<HTMLDivElement | null>(null)
  const tabItemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // 🔥 GROUP BY CATEGORY
  const grouped = products.reduce(
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

  const categories = Object.keys(grouped)

  // 🔥 SCROLL TO CATEGORY
  const scrollToCategory = (cat: string) => {
    const el = categoryRefs.current[cat]

    if (!el) return

    const offset =
      (window.innerWidth < 768
        ? NAVBAR_HEIGHT.mobile
        : NAVBAR_HEIGHT.desktop) + 70

    const y =
      el.getBoundingClientRect().top +
      window.pageYOffset -
      offset

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    })
  }

  // 🔥 ACTIVE TAB ON SCROLL
  useEffect(() => {
    const handleScroll = () => {
      let current = ''

      const scrollPosition =
        window.innerHeight + window.scrollY

      const pageHeight =
        document.body.offsetHeight

      // fondo pagina
      if (scrollPosition >= pageHeight - 50) {
        current = categories[categories.length - 1]
      } else {
        categories.forEach((cat) => {
          const el = categoryRefs.current[cat]

          if (!el) return

          const rect = el.getBoundingClientRect()

          if (
            rect.top <= 150 &&
            rect.bottom >= 150
          ) {
            current = cat
          }
        })
      }

      if (
        current &&
        current !== activeCategory
      ) {
        setActiveCategory(current)
      }
    }

    window.addEventListener(
      'scroll',
      handleScroll
    )

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      )
    }
  }, [categories, activeCategory])

  return (
    <Box
      sx={{
        width: '100%',
        pb: 10
      }}
    >
      {/* 🔥 CATEGORY TABS */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        scrollToCategory={scrollToCategory}
        tabsRef={tabsRef}
        tabItemRefs={tabItemRefs}
      />

      {/* 🔥 CONTENT */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: 0
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
              ref={(el: HTMLDivElement | null) => {
                categoryRefs.current[category] = el
              }}
              sx={{
                mt: 1,
                px: 1
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 'bold'
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
import {
  Typography,
  Box
} from '@mui/material'
import ProductCard from '../components/product/ProductCard'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

// 🔥 altezza navbar
const NAVBAR_HEIGHT = {
  mobile: 56,
  desktop: 64
}

type Product = {
  id: number
  name: string
  description?: string
  price: number
  image: string
  category?: string
}

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState('')
  const [loading, setLoading] = useState(true)

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const tabsRef = useRef<HTMLDivElement | null>(null)
  const tabItemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const indicatorRef = useRef<HTMLDivElement | null>(null)

  // 🔥 FETCH
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

  // 🔥 GROUP BY CATEGORY
  const grouped = products.reduce((acc: any, product) => {
    const category = product.category || 'Altro'
    if (!acc[category]) acc[category] = []
    acc[category].push(product)
    return acc
  }, {})

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

    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  // 🔥 ACTIVE TAB ON SCROLL (PRO FIX)
  useEffect(() => {
    const handleScroll = () => {
      let current = ''

      const scrollPosition = window.innerHeight + window.scrollY
      const pageHeight = document.body.offsetHeight

      // fondo pagina
      if (scrollPosition >= pageHeight - 50) {
        current = categories[categories.length - 1]
      } else {
        categories.forEach((cat) => {
          const el = categoryRefs.current[cat]
          if (!el) return

          const rect = el.getBoundingClientRect()

          if (rect.top <= 150 && rect.bottom >= 150) {
            current = cat
          }
        })
      }

      if (current && current !== activeCategory) {
        setActiveCategory(current)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [categories, activeCategory])

  // 🔥 AUTO CENTER + INDICATOR
    useEffect(() => {
      const tabEl = tabItemRefs.current[activeCategory]

      if (!tabEl) return

      tabEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      })
    }, [activeCategory])

  return (
    <Box sx={{ width: '100%', pb: 10 }}>
      {/* 🔥 TABS PRO */}
      <Box
        ref={tabsRef}
        sx={{
          position: 'sticky',
          top: {
            xs: NAVBAR_HEIGHT.mobile,
            md: NAVBAR_HEIGHT.desktop
          },
          zIndex: 1000,

          display: 'flex',
          overflowX: 'auto',
          gap: 3,

          px: 2,
          py: 1.5,

          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255,255,255,0.9)',

          borderBottom: '1px solid rgba(0,0,0,0.08)',

          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {/* INDICATOR */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 6,
            height: 3,
            borderRadius: 2,
            background: 'linear-gradient(45deg,#ff416c,#ff4b2b)',
            transition: 'all 0.25s ease'
          }}
        />

        {categories.map((cat) => (
        <Box
          key={cat}
          ref={(el: HTMLDivElement | null) => {
            tabItemRefs.current[cat] = el
          }}
          onClick={() => scrollToCategory(cat)}
          sx={{
            position: 'relative',
            whiteSpace: 'nowrap',
            cursor: 'pointer',

            px: 2.2,
            py: 0.8,
            borderRadius: '999px',

            fontWeight: 600,

            color: activeCategory === cat ? '#fff' : '#333',

            background:
              activeCategory === cat
                ? 'linear-gradient(45deg,#ff416c,#ff4b2b)'
                : 'rgba(0,0,0,0.05)',

            boxShadow:
              activeCategory === cat
                ? '0 4px 14px rgba(255,75,43,0.35)'
                : 'none',

            transition: 'all 0.25s ease',

            '&:active': {
              transform: 'scale(0.92)'
            }
          }}
        >
          {cat}
        </Box>
        ))}
      </Box>

      {/* CONTENUTO */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 4 }
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
              sx={{ mt: 4 }}
            >
              <Typography
                variant="h5"
                sx={{ mb: 2, fontWeight: 'bold' }}
              >
                {category}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2
                }}
              >
                {grouped[category].map((product: Product) => (
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
                    <ProductCard product={product} />
                  </Box>
                ))}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}
import { Box } from '@mui/material'
import { useEffect } from 'react'
import type { RefObject } from 'react'

const NAVBAR_HEIGHT = {
  mobile: 56,
  desktop: 64
}

type Props = {
  categories: string[]
  activeCategory: string
  setActiveCategory: (cat: string) => void
  scrollToCategory: (cat: string) => void
  tabsRef: RefObject<HTMLDivElement | null>
  tabItemRefs: RefObject<Record<string, HTMLDivElement | null>>
}

export default function CategoryTabs({
  categories,
  activeCategory,
  scrollToCategory,
  tabItemRefs,
  tabsRef
}: Props) {

  // 🔥 AUTO SCROLL TAB
  useEffect(() => {
    const tabEl = tabItemRefs.current[activeCategory]

    if (!tabEl) return

    tabEl.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    })
  }, [activeCategory, tabItemRefs])

  return (
    <Box
      ref={tabsRef}
      sx={{
        position: 'sticky',
        top: {
          xs: NAVBAR_HEIGHT.mobile,
          md: NAVBAR_HEIGHT.desktop
        },

        width: '100%',
        left: 0,
        right: 0,

        zIndex: 1000,

        display: 'flex',
        overflowX: 'auto',


        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(0,0,0,0.8)',

        borderBottom: '1px solid rgba(0,0,0,0.08)',

        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      {categories.map((cat) => (
        <Box
          key={cat}
          ref={(el: HTMLDivElement | null) => {
            tabItemRefs.current[cat] = el
          }}
          onClick={() => scrollToCategory(cat)}
          sx={{
            whiteSpace: 'nowrap',
            cursor: 'pointer',

            mx: 1,
            my: 1,

            px: 2.2,
            py: 0.8,

            borderRadius: '999px',

            fontWeight: 600,

            color:
              activeCategory === cat
                ? '#fff'
                : '#fff',

            background:
              activeCategory === cat
                ? 'linear-gradient(45deg,#ff416c,#ff4b2b)'
                : '#050000',

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
  )
}
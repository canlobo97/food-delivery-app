import { Fab, Badge } from '@mui/material'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { colors } from '../theme/colors'

export default function FloatingCart() {
  const navigate = useNavigate()
  const location = useLocation()

  const cartItems = useSelector((state: any) => state.cart.items)
  const totalItems = cartItems.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  )

  const [animate, setAnimate] = useState(false)
  const prevTotalRef = useRef(totalItems)

  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      setAnimate(true)
      if (navigator.vibrate) navigator.vibrate(40)
      const timeout = setTimeout(() => setAnimate(false), 280)
      prevTotalRef.current = totalItems
      return () => clearTimeout(timeout)
    }
    prevTotalRef.current = totalItems
  }, [totalItems])

  const hidden = ['/cart', '/login', '/admin', '/checkout', '/register']
  if (hidden.some((p) => location.pathname.includes(p))) return null
  if (totalItems === 0) return null

  return (
    <Fab
      onClick={() => navigate('/cart')}
      aria-label="Apri carrello"
      sx={{
        position: 'fixed',
        top: { xs: 'auto', md: 80 },
        bottom: {
          xs: 'calc(76px + env(safe-area-inset-bottom))',
          md: 'auto',
        },
        right: 16,
        zIndex: 1000,
        bgcolor: colors.accent,
        color: '#fff',
        boxShadow: colors.shadowFab,
        transform: animate ? 'scale(1.12)' : 'scale(1)',
        transition: 'transform 0.2s ease',
        '&:hover': { bgcolor: colors.accentDark },
      }}
    >
      <Badge
        badgeContent={totalItems}
        sx={{
          '& .MuiBadge-badge': {
            bgcolor: colors.ink,
            color: '#fff',
            fontWeight: 700,
          },
        }}
      >
        <ShoppingBagOutlinedIcon />
      </Badge>
    </Fab>
  )
}

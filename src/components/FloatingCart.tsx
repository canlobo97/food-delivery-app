import { Fab, Badge } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'

export default function FloatingCart() {
  const navigate = useNavigate()
  const location = useLocation()

  const cartItems = useSelector((state: any) => state.cart.items)

  const totalItems = cartItems.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  )

  const [animate, setAnimate] = useState(false)

  // 🔥 salva valore precedente
  const prevTotalRef = useRef(totalItems)

  useEffect(() => {
    // 👉 trigger SOLO se aumenta
    if (totalItems > prevTotalRef.current) {
      setAnimate(true)

      if (navigator.vibrate) {
        navigator.vibrate(100)
      }

      const timeout = setTimeout(() => {
        setAnimate(false)
      }, 300)

      return () => clearTimeout(timeout)
    }

    prevTotalRef.current = totalItems
  }, [totalItems])

  if (location.pathname === '/cart') return null
  if (totalItems === 0) return null

  return (
    <Fab
      onClick={() => navigate('/cart')}
      sx={{
        position: 'fixed',
        top: 80,
        right: 20,
        zIndex: 1000,

        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#fff',

        boxShadow:
          totalItems > 0
            ? '0 0 15px rgba(255,0,0,0.6), 0 8px 25px rgba(0,0,0,0.4)'
            : '0 8px 25px rgba(0,0,0,0.4)',

        border: '1px solid rgba(255,255,255,0.1)',

        transform: animate ? 'scale(1.2)' : 'scale(1)',
        transition: 'all 0.2s ease',

        '&:hover': {
          transform: 'scale(1.1)',
          backgroundColor: 'rgba(0,0,0,0.9)'
        }
      }}
    >
      <Badge badgeContent={totalItems} color="error">
        <ShoppingCartIcon />
      </Badge>
    </Fab>
  )
}
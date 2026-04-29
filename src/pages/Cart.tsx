import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  clearCart
} from '../store/cartSlice'
import type { RootState, AppDispatch } from '../store/store'
import {
  Container,
  Typography,
  Button,
  Box
} from '@mui/material'
import CartItem from '../components/product/CartItem'

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>()
  const cart = useSelector((state: RootState) => state.cart.items)

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <Container sx={{ mt: 4, pb: 20 }}>

      {/* 🔥 HEADER */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography variant="h4">
          Carrello 🛒
        </Typography>

        {cart.length > 0 && (
          <Button
            onClick={() => dispatch(clearCart())}
            sx={{
              color: '#ff4b2b',
              fontWeight: 'bold',
              textTransform: 'none'
            }}
          >
            🗑 Svuota
          </Button>
        )}
      </Box>

      {cart.length === 0 ? (
        <Typography>Il carrello è vuoto</Typography>
      ) : (
        <>
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* 🔥 STICKY BOTTOM BAR */}
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              width: '100%',
              zIndex: 2000,
              backdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(0,0,0,0.9)',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {/* 👇 CONTENITORE CENTRATO */}
            <Box
              sx={{
                maxWidth: 600,
                mx: 'auto',
                width: '90%',
                px: 1, // 🔥 QUESTO RISOLVE MOBILE
                py: 3
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                {/* TORNA */}
                <Button
                  fullWidth
                  variant="contained"
                  component={Link}
                  to="/menu"
                  sx={{
                    height: 50,
                    fontWeight: 'bold',
                    textTransform: 'none',

                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                  ← Torna ad ordinare
                </Button>

                {/* 💰 TOTALE + 💳 PAGA */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,

                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {/* TOTALE */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.7,
                        color: '#fff' // 🔥 FIX COLORE
                      }}
                    >
                      Totale
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: '#fff' // 🔥 FIX COLORE
                      }}
                    >
                      {total}€
                    </Typography>
                  </Box>

                  {/* PAGA */}
                  <Button
                    variant="contained"
                    component={Link}
                    to="/checkout"
                    sx={{
                      height: 55,
                      px: 4,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',

                      background: 'linear-gradient(45deg, #ff416c, #ff4b2b)',
                      boxShadow: '0 6px 20px rgba(255,75,43,0.5)'
                    }}
                  >
                    💳 Paga
                  </Button>
                </Box>

              </Box>
            </Box>
          </Box>
        </>
      )}
    </Container>
  )
}
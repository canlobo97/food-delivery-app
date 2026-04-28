import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart
} from '../store/cartSlice'
import type { RootState, AppDispatch } from '../store/store'
import {
  Container,
  Typography,
  Button,
  Box
} from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>()
  const cart = useSelector((state: RootState) => state.cart.items)

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Carrello 🛒
      </Typography>

      {cart.length === 0 ? (
        <Typography>Il carrello è vuoto</Typography>
      ) : (
        <>
          {cart.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                p: 2,
                borderRadius: 3,

                // 🔥 GLASS STYLE
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.4)',

                transition: 'all 0.2s ease',

                '&:hover': {
                  transform: 'scale(1.01)',
                  backgroundColor: 'rgba(0,0,0,0.8)'
                }
              }}
            >
              {/* NOME */}
              <Typography sx={{ fontWeight: 500 }}>
                {item.name}
              </Typography>

              {/* PREZZO */}
              <Typography sx={{ fontWeight: 'bold' }}>
                {item.price * item.quantity}€
              </Typography>

              {/* CONTROLLI */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => dispatch(decrementQuantity(item.id))}
                  sx={{
                    minWidth: 40,
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.2)'
                  }}
                >
                  <RemoveIcon />
                </Button>

                <Typography sx={{ minWidth: 20, textAlign: 'center' }}>
                  {item.quantity}
                </Typography>

                <Button
                  variant="outlined"
                  onClick={() => dispatch(incrementQuantity(item.id))}
                  sx={{
                    minWidth: 40,
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.2)'
                  }}
                >
                  <AddIcon />
                </Button>

                <Button
                  color="error"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Rimuovi
                </Button>
              </Box>
            </Box>
          ))}

          {/* 💰 TOTALE */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Typography variant="h5">
              Totale: {total}€
            </Typography>
          </Box>

          {/* 🔥 BOTTONI */}
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3 }}>

            {/* 🔥 PRIMA RIGA */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              
              {/* 🔙 TORNA */}
              <Button
                variant="contained"
                component={Link}
                to="/menu"
                sx={{
                  flex: 1,
                  height: 60,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  backgroundColor: '#d32f2f',
                  '&:hover': {
                  transform: 'scale(1.02)'
                  }
                }}
              >
                Ordina ancora
              </Button>

              {/* 🗑 SVUOTA */}
              <Button
                variant="contained"
                onClick={() => dispatch(clearCart())}
                sx={{
                  flex: 1,
                  height: 60,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  backgroundColor: '#d32f2f',
                  '&:hover': {
                  transform: 'scale(1.02)'
                }
                }}
              >
                🗑 Svuota
              </Button>
            </Box>

            {/* 💳 PAGA */}
            <Button
              variant="contained"
              component={Link}
              to="/checkout"
              sx={{
                height: 65,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textTransform: 'none',

                background: 'linear-gradient(45deg, #ff416c, #ff4b2b)',
                boxShadow: '0 6px 20px rgba(255,75,43,0.5)',

                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              💳 Paga
            </Button>

          </Box>
        </>
      )}
    </Container>
  )
}
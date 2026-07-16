import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { clearCart } from '../store/cartSlice'
import type { RootState, AppDispatch } from '../store/store'

import { Container, Typography, Button, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

import CartItem from '../components/product/CartItem'
import { formatPrice } from '../utils/format'
import { colors, fontFamily } from '../theme/colors'

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>()
  const cart = useSelector((state: RootState) => state.cart.items)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Container
      sx={{
        mt: 2,
        px: { xs: 1.5, sm: 2 },
        pb: { xs: 28, md: 20 },
        minHeight: '100dvh',
        bgcolor: colors.bg,
        maxWidth: '100% !important',
        fontFamily,
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 800, fontFamily }}
          >
            Carrello
          </Typography>

          {cart.length > 0 && (
            <Button
              onClick={() => dispatch(clearCart())}
              endIcon={<DeleteIcon />}
              sx={{
                color: colors.accent,
                fontWeight: 700,
                textTransform: 'none',
                fontFamily,
              }}
            >
              Svuota
            </Button>
          )}
        </Box>

        {cart.length === 0 ? (
          <Box sx={{ mt: 6, textAlign: 'center', px: 2 }}>
            <Typography sx={{ color: colors.muted, mb: 2, fontFamily }}>
              Il carrello è vuoto
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/menu"
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: colors.accent,
                fontFamily,
                '&:hover': { bgcolor: colors.accentDark },
              }}
            >
              Vai al menu
            </Button>
          </Box>
        ) : (
          <>
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <Box
              sx={{
                position: 'fixed',
                bottom: {
                  xs: 'calc(64px + env(safe-area-inset-bottom))',
                  md: 0,
                },
                left: 0,
                width: '100%',
                zIndex: 1100,
                bgcolor: colors.navBg,
                backdropFilter: 'blur(16px)',
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <Box
                sx={{
                  maxWidth: 560,
                  mx: 'auto',
                  width: '100%',
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: colors.muted, fontWeight: 600, fontFamily }}
                  >
                    Totale
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, lineHeight: 1.2, fontFamily }}
                  >
                    {formatPrice(total)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  component={Link}
                  to="/checkout"
                  sx={{
                    height: 52,
                    px: 3,
                    minWidth: 140,
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontFamily,
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
                    boxShadow: colors.shadowFab,
                  }}
                >
                  Continua
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Container>
  )
}

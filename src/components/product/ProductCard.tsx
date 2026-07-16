import {
  Card,
  Typography,
  Box,
  IconButton
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

import { useDispatch, useSelector } from 'react-redux'

import { addToCart } from '../../store/cartSlice'

import type {
  AppDispatch,
  RootState
} from '../../store/store'

import { formatPrice } from '../../utils/format'
import { colors } from '../../theme/colors'

type Product = {
  id: number
  name: string
  description?: string
  price: number
  image: string
}

export default function ProductCard({
  product
}: {
  product: Product
}) {
  const dispatch = useDispatch<AppDispatch>()

  const quantity = useSelector(
    (state: RootState) =>
      state.cart.items.find(
        (item) => item.id === product.id
      )?.quantity || 0
  )

  const handleAdd = () => {
    dispatch(addToCart(product))
  }

  return (
    <Card
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: {
          xs: 'row',
          md: 'column'
        },

        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: colors.surface,
        color: colors.ink,
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
        fontFamily: '"Outfit", system-ui, sans-serif',

        transition: 'transform 0.18s ease',

        '&:active': {
          transform: 'scale(0.985)'
        }
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2,
          order: { xs: 1, md: 2 },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontFamily: 'inherit',
              fontSize: {
                xs: '1rem',
                md: '1.1rem'
              },
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
            }}
          >
            {product.name}
          </Typography>

          {product.description && (
            <Typography
              sx={{
                mt: 0.5,
                color: colors.muted,
                fontSize: '0.8rem',
                fontFamily: 'inherit',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.description}
            </Typography>
          )}

          <Typography
            sx={{
              mt: 1.25,
              fontWeight: 800,
              fontFamily: 'inherit',
              fontSize: '1.05rem',
            }}
          >
            {formatPrice(product.price)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 1,
          }}
        >
          <IconButton
            onClick={handleAdd}
            aria-label="Aggiungi al carrello"
            sx={{
              minWidth: 44,
              height: 44,
              px: quantity > 0 ? 1.75 : 0,
              borderRadius: '999px',
              bgcolor: quantity > 0 ? colors.accent : colors.ink,
              color: '#fff',
              transition: 'transform 0.15s ease, background-color 0.15s ease',
              '&:hover': {
                bgcolor: quantity > 0 ? colors.accentDark : colors.ink,
              },
              '&:active': {
                transform: 'scale(0.92)',
              },
            }}
          >
            {quantity > 0 ? (
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                }}
              >
                {quantity}
              </Typography>
            ) : (
              <AddIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      <Box
        component="img"
        src={product.image}
        alt={product.name}
        sx={{
          width: {
            xs: 112,
            md: '100%'
          },
          aspectRatio: '1 / 1',
          objectFit: 'cover',
          display: 'block',
          order: { xs: 2, md: 1 },
          flexShrink: 0,
        }}
      />
    </Card>
  )
}

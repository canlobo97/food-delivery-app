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
      sx={{
        display: 'flex',
        flexDirection: {
          xs: 'row',
          md: 'column'
        },

        borderRadius: 3,
        overflow: 'hidden',

        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0,0,0,0.75)',

        color: '#fff',

        border:
          '1px solid rgba(255,255,255,0.08)',

        boxShadow:
          '0 10px 30px rgba(0,0,0,0.4)',

        transition: 'all 0.2s ease',

        '&:hover': {
          transform: 'scale(1.02)'
        },

        '&:active': {
          transform: 'scale(0.98)'
        }
      }}
    >
      {/* 📄 CONTENUTO */}
      <Box
        sx={{
          flex: 1,

          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',

          p: 2
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 600,

              fontSize: {
                xs: '1rem',
                md: '1.1rem'
              }
            }}
          >
            {product.name}
          </Typography>

          {product.description && (
            <Typography
              sx={{
                mt: 0.5,
                opacity: 0.6,
                fontSize: '0.8rem'
              }}
            >
              {product.description}
            </Typography>
          )}

          <Typography
            sx={{
              mt: 1,
              fontWeight: 'bold'
            }}
          >
            {formatPrice(product.price)}
          </Typography>
        </Box>

        {/* ➕ ADD / QUANTITY */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <IconButton
            onClick={handleAdd}
            sx={{
              minWidth: 42,
              height: 42,

              px: quantity > 0 ? 2 : 0,

              borderRadius: '999px',

              backdropFilter: 'blur(10px)',

              backgroundColor:
                quantity > 0
                  ? '#ff4b2b'
                  : 'rgba(255,255,255,0.1)',

              color: '#fff',

              border:
                '1px solid rgba(255,255,255,0.15)',

              transition: 'all 0.2s ease',

              '&:hover': {
                backgroundColor:
                  quantity > 0
                    ? '#ff2600'
                    : 'rgba(255,255,255,0.2)'
              }
            }}
          >
            {quantity > 0 ? (
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '0.95rem'
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

      {/* 🖼 IMMAGINE */}
      <Box
        component="img"
        src={product.image}
        alt={product.name}
        sx={{
          width: {
            xs: 110,
            md: '100%'
          },

          aspectRatio: '1 / 1',

          objectFit: 'cover',

          display: 'block',

          borderTopRightRadius: {
            xs: 12,
            md: 12
          },

          borderBottomRightRadius: {
            xs: 12,
            md: 0
          },

          borderTopLeftRadius: {
            md: 12
          }
        }}
      />
    </Card>
  )
}
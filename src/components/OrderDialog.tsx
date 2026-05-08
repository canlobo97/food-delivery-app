import {
  Dialog,
  Box,
  Typography,
  Button,
  Slide,
  IconButton,
  Divider
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import PersonIcon from '@mui/icons-material/Person'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'

import { forwardRef } from 'react'
import type { ReactElement, Ref } from 'react'
import type { TransitionProps } from '@mui/material/transitions'

import { formatPrice } from '../utils/format'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any>
  },
  ref: Ref<unknown>
) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  )
})

type Props = {
  order: any | null
  onAccept: (order: any) => void
  onReject: (order: any) => void
}

export default function OrderDialog({
  order,
  onAccept,
  onReject
}: Props) {
  return (
    <Dialog
      open={!!order}
      fullScreen
      slots={{
        transition: Transition
      }}
      onClose={(_, reason) => {
        if (
          reason === 'backdropClick' ||
          reason === 'escapeKeyDown'
        ) {
          return
        }
      }}
      slotProps={{
        paper: {
          sx: {
            background:
              'linear-gradient(to bottom, #111, #1a1a1a)',
            color: '#fff'
          }
        }
      }}
    >
      {order && (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 10,

              backdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(0,0,0,0.7)',

              borderBottom:
                '1px solid rgba(255,255,255,0.08)',

              px: 2,
              py: 2,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: '1.3rem',
                  fontWeight: 700
                }}
              >
                🚨 Nuovo Ordine
              </Typography>

              <Typography
                sx={{
                  opacity: 0.6,
                  fontSize: '0.9rem'
                }}
              >
                #{order.id?.slice?.(0, 6)}
              </Typography>
            </Box>

            <IconButton
              sx={{
                color: '#fff',
                background:
                  'rgba(255,255,255,0.08)'
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* CONTENT */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2
            }}
          >
            {/* CUSTOMER */}
            <Box
              sx={{
                p: 2,
                borderRadius: 4,

                background:
                  'rgba(255,255,255,0.05)',

                border:
                  '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}
              >
                <PersonIcon />

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem'
                  }}
                >
                  {order.customer?.name}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1
                }}
              >
                <LocationOnIcon
                  sx={{
                    fontSize: 18,
                    opacity: 0.7
                  }}
                />

                <Typography
                  sx={{
                    opacity: 0.8
                  }}
                >
                  {order.customer?.address}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <PhoneIcon
                  sx={{
                    fontSize: 18,
                    opacity: 0.7
                  }}
                />

                <Typography
                  sx={{
                    opacity: 0.8
                  }}
                >
                  {order.customer?.phone}
                </Typography>
              </Box>
            </Box>

            {/* PRODUCTS */}
            <Box sx={{ mt: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}
              >
                <ShoppingBagIcon />

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem'
                  }}
                >
                  Prodotti
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5
                }}
              >
                {order.items?.map((item: any) => (
                  <Box
                    key={item.id}
                    sx={{
                      p: 2,
                      borderRadius: 3,

                      background:
                        'rgba(255,255,255,0.04)',

                      border:
                        '1px solid rgba(255,255,255,0.06)',

                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          opacity: 0.6,
                          fontSize: '0.85rem'
                        }}
                      >
                        Quantità: {item.quantity}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontWeight: 700
                      }}
                    >
                      {formatPrice(
                        item.price * item.quantity
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* TOTAL */}
            <Box
              sx={{
                mt: 4,
                p: 2.5,
                borderRadius: 4,

                background:
                  'linear-gradient(45deg,#ff416c,#ff4b2b)',

                boxShadow:
                  '0 10px 30px rgba(255,75,43,0.35)'
              }}
            >
              <Typography
                sx={{
                  opacity: 0.8,
                  fontSize: '0.9rem'
                }}
              >
                Totale Ordine
              </Typography>

              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 800
                }}
              >
                {formatPrice(order.total)}
              </Typography>
            </Box>
          </Box>

          <Divider
            sx={{
              borderColor:
                'rgba(255,255,255,0.08)'
            }}
          />

          {/* ACTIONS */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              gap: 2,

              backdropFilter: 'blur(12px)',
              backgroundColor:
                'rgba(0,0,0,0.7)'
            }}
          >
            <Button
              fullWidth
              onClick={() => onReject(order)}
              sx={{
                height: 56,
                borderRadius: 4,

                background:
                  'rgba(255,255,255,0.08)',

                color: '#fff',

                fontWeight: 700,

                '&:hover': {
                  background:
                    'rgba(255,255,255,0.12)'
                }
              }}
            >
              ❌ Rifiuta
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={() => onAccept(order)}
              sx={{
                height: 56,
                borderRadius: 4,

                fontWeight: 700,

                background:
                  'linear-gradient(45deg,#ff416c,#ff4b2b)',

                boxShadow:
                  '0 8px 24px rgba(255,75,43,0.35)'
              }}
            >
              ✅ Accetta
            </Button>
          </Box>
        </Box>
      )}
    </Dialog>
  )
}
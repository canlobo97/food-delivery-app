import {
  Dialog,
  Box,
  Typography,
  Button,
  Slide,
  IconButton
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
import { colors, fontFamily } from '../theme/colors'

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
            background: colors.bg,
            color: colors.ink,
            fontFamily,
          }
        }
      }}
    >
      {order && (
        <Box
          sx={{
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              backdropFilter: 'blur(12px)',
              backgroundColor: colors.navBg,
              borderBottom: `1px solid ${colors.border}`,
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
                  fontWeight: 700,
                  fontFamily,
                  color: colors.ink,
                }}
              >
                🚨 Nuovo Ordine
              </Typography>

              <Typography
                sx={{
                  color: colors.muted,
                  fontSize: '0.9rem',
                  fontFamily,
                }}
              >
                #{order.id?.slice?.(0, 6)}
              </Typography>
            </Box>

            <IconButton
              onClick={() => onReject(order)}
              sx={{
                color: colors.ink,
                background: colors.accentSoft,
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
              p: 2,
              pb: 8
            }}
          >
            {/* CUSTOMER */}
            <Box
              sx={{
                p: 2,
                borderRadius: 4,
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                boxShadow: colors.shadow,
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
                <PersonIcon sx={{ color: colors.accent }} />

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    fontFamily,
                    color: colors.ink,
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
                    color: colors.muted,
                  }}
                />

                <Typography
                  sx={{
                    color: colors.muted,
                    fontFamily,
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
                    color: colors.muted,
                  }}
                />

                <Typography
                  sx={{
                    color: colors.muted,
                    fontFamily,
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
                <ShoppingBagIcon sx={{ color: colors.accent }} />

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    fontFamily,
                    color: colors.ink,
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
                      background: colors.surface,
                      border: `1px solid ${colors.border}`,
                      boxShadow: colors.shadow,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: colors.ink,
                          fontFamily,
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          color: colors.muted,
                          fontSize: '0.85rem',
                          fontFamily,
                        }}
                      >
                        Quantità: {item.quantity}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: colors.ink,
                        fontFamily,
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
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
                boxShadow: colors.shadowFab,
                color: '#fff',
              }}
            >
              <Typography
                sx={{
                  opacity: 0.9,
                  fontSize: '0.9rem',
                  fontFamily,
                }}
              >
                Totale Ordine
              </Typography>

              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  fontFamily,
                }}
              >
                {formatPrice(order.total)}
              </Typography>
            </Box>

            {/* ACTIONS */}
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                gap: 2,
                pb: {
                  xs: 'calc(24px + env(safe-area-inset-bottom))',
                  md: 2
                }
              }}
            >
              <Button
                fullWidth
                onClick={() => onReject(order)}
                sx={{
                  height: 56,
                  borderRadius: 4,
                  background: colors.surface,
                  border: `1px solid ${colors.borderStrong}`,
                  color: colors.ink,
                  fontWeight: 700,
                  fontFamily,
                  textTransform: 'none',
                  '&:hover': {
                    background: colors.bg,
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
                  fontFamily,
                  textTransform: 'none',
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
                  boxShadow: colors.shadowFab,
                }}
              >
                ✅ Accetta
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Dialog>
  )
}

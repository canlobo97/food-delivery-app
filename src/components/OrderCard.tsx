import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Slide
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining'

import { forwardRef, useState } from 'react'
import type { TransitionProps } from '@mui/material/transitions'

import { formatPrice } from '../utils/format'
import { colors, fontFamily } from '../theme/colors'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any>
  },
  ref: React.Ref<unknown>
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
  order: any
  onUpdateStatus: (
    id: string,
    status: string
  ) => void
}

export default function OrderCard({
  order,
  onUpdateStatus
}: Props) {
  const [open, setOpen] = useState(false)

  const getStatusColor = () => {
    switch (order.status) {
      case 'in_preparazione':
        return '#ff9800'

      case 'in_consegna':
        return '#2196f3'

      case 'consegnato':
        return '#4caf50'

      case 'cancellato':
        return '#ff0303'

      default:
        return colors.muted
    }
  }

  const deliveryLabel = order.asap
    ? '⚡ Il prima possibile'
    : order.delivery_time || 'Non specificato'

  return (
    <>
      {/* CARD */}
      <Box
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: 4,
          p: 2,
          mt: 2,
          cursor: 'pointer',
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: colors.shadow,
          color: colors.ink,
          fontFamily,
          transition: 'all 0.25s ease',
          '&:active': {
            transform: 'scale(0.98)'
          }
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography
              sx={{
                color: colors.ink,
                fontWeight: 700,
                fontSize: '1.05rem',
                fontFamily,
              }}
            >
              👤 {order.customer?.name}
            </Typography>

            <Typography
              sx={{
                color: colors.muted,
                fontSize: '0.85rem',
                mt: 0.3,
                fontFamily,
              }}
            >
              📞 {order.customer?.phone}
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1.5,
              py: 0.7,
              borderRadius: '999px',
              background: getStatusColor(),
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              fontFamily,
            }}
          >
            {order.status.replaceAll('_', ' ')}
          </Box>
        </Box>

        {/* INFO */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ReceiptLongIcon
              sx={{
                color: colors.accent,
                fontSize: 20
              }}
            />

            <Typography
              sx={{
                color: colors.ink,
                fontWeight: 600,
                fontFamily,
              }}
            >
              {order.items?.length} prodotti
            </Typography>
          </Box>

          <Typography
            sx={{
              color: colors.ink,
              fontWeight: 800,
              fontSize: '1rem',
              fontFamily,
            }}
          >
            {formatPrice(order.total)}
          </Typography>
        </Box>

        {/* DELIVERY TIME */}
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 3,
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <DeliveryDiningIcon
            sx={{
              color: colors.accent
            }}
          />

          <Box>
            <Typography
              sx={{
                color: colors.muted,
                fontSize: '0.75rem',
                fontFamily,
              }}
            >
              Consegna richiesta
            </Typography>

            <Typography
              sx={{
                color: colors.ink,
                fontWeight: 700,
                fontFamily,
              }}
            >
              {deliveryLabel}
            </Typography>
          </Box>
        </Box>

        {/* CREATED */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 1.5
          }}
        >
          <AccessTimeIcon
            sx={{
              color: colors.muted,
              fontSize: 18
            }}
          />

          <Typography
            sx={{
              color: colors.muted,
              fontSize: '0.8rem',
              fontFamily,
            }}
          >
            {new Date(order.created_at).toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* MODAL */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen
        slots={{
          transition: Transition
        }}
      >
        <DialogContent
          sx={{
            background: colors.bg,
            color: colors.ink,
            p: 0,
            minHeight: '100vh',
            fontFamily,
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              backdropFilter: 'blur(12px)',
              background: colors.navBg,
              borderBottom: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 2
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.2rem',
                fontFamily,
                color: colors.ink,
              }}
            >
              Ordine #{order.id}
            </Typography>

            <IconButton
              onClick={() => setOpen(false)}
              sx={{ color: colors.ink }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* CONTENT */}
          <Box sx={{ p: 2.5 }}>
            {/* STATUS */}
            <Box
              sx={{
                display: 'inline-flex',
                px: 2,
                py: 1,
                borderRadius: '999px',
                background: getStatusColor(),
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontFamily,
              }}
            >
              {order.status.replaceAll('_', ' ')}
            </Box>

            {/* DELIVERY TIME */}
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 4,
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                boxShadow: colors.shadow,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <DeliveryDiningIcon
                sx={{
                  color: colors.accent,
                  fontSize: 34
                }}
              />

              <Box>
                <Typography
                  sx={{
                    color: colors.muted,
                    fontSize: '0.85rem',
                    fontFamily,
                  }}
                >
                  Orario consegna
                </Typography>

                <Typography
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: colors.ink,
                    fontFamily,
                  }}
                >
                  {deliveryLabel}
                </Typography>
              </Box>
            </Box>

            {/* CUSTOMER */}
            <Box sx={{ mt: 4 }}>
              <Typography
                sx={{
                  color: colors.muted,
                  mb: 1,
                  fontFamily,
                }}
              >
                Cliente
              </Typography>

              <Typography sx={{ fontSize: '1.1rem', color: colors.ink, fontFamily }}>
                👤 {order.customer?.name}
              </Typography>

              <Typography sx={{ mt: 1, color: colors.muted, fontFamily }}>
                📞 {order.customer?.phone}
              </Typography>

              <Typography sx={{ mt: 1, color: colors.muted, fontFamily }}>
                📍 {order.customer?.address}
              </Typography>
            </Box>

            {/* PRODUCTS */}
            <Box sx={{ mt: 4 }}>
              <Typography
                sx={{
                  color: colors.muted,
                  mb: 2,
                  fontFamily,
                }}
              >
                Prodotti
              </Typography>

              {order.items?.map((item: any) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    mb: 1.5,
                    borderRadius: 3,
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    boxShadow: colors.shadow,
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
                      fontWeight: 'bold',
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

            {/* TOTAL */}
            <Box
              sx={{
                mt: 4,
                p: 2.5,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: colors.shadowFab,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  fontFamily,
                }}
              >
                Totale
              </Typography>

              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                  fontFamily,
                }}
              >
                {formatPrice(order.total)}
              </Typography>
            </Box>

            {/* ACTIONS */}
            <Box
              sx={{
                mt: 4,
                display: 'flex',
                gap: 1.5,
                pb: 4
              }}
            >
              {order.status ===
                'in_preparazione' && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    onUpdateStatus(
                      order.id,
                      'in_consegna'
                    )
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    fontFamily,
                    textTransform: 'none',
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
                    boxShadow: colors.shadowFab,
                  }}
                >
                  🚚 In consegna
                </Button>
              )}

              {order.status ===
                'in_consegna' && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    onUpdateStatus(
                      order.id,
                      'consegnato'
                    )
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    fontFamily,
                    textTransform: 'none',
                    background: 'linear-gradient(45deg,#4caf50,#2e7d32)'
                  }}
                >
                  ✅ Consegnato
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

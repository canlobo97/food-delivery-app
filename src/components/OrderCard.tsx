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
        return '#fff'
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

          backdropFilter: 'blur(14px)',

          background:
            'linear-gradient(180deg, rgba(25,25,25,0.95), rgba(10,10,10,0.95))',

          border:
            '1px solid rgba(255,255,255,0.08)',

          boxShadow:
            '0 12px 30px rgba(0,0,0,0.45)',

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
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.05rem'
              }}
            >
              👤 {order.customer?.name}
            </Typography>

            <Typography
              sx={{
                color: '#aaa',
                fontSize: '0.85rem',
                mt: 0.3
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

              textTransform: 'uppercase'
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
                color: '#ff4b2b',
                fontSize: 20
              }}
            />

            <Typography
              sx={{
                color: '#fff',
                fontWeight: 600
              }}
            >
              {order.items?.length} prodotti
            </Typography>
          </Box>

          <Typography
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem'
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

            background:
              'rgba(255,255,255,0.05)',

            border:
              '1px solid rgba(255,255,255,0.06)',

            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <DeliveryDiningIcon
            sx={{
              color: '#ff4b2b'
            }}
          />

          <Box>
            <Typography
              sx={{
                color: '#888',
                fontSize: '0.75rem'
              }}
            >
              Consegna richiesta
            </Typography>

            <Typography
              sx={{
                color: '#fff',
                fontWeight: 700
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
              color: '#777',
              fontSize: 18
            }}
          />

          <Typography
            sx={{
              color: '#999',
              fontSize: '0.8rem'
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
            background:
              'linear-gradient(180deg,#111,#000)',

            color: '#fff',

            p: 0,

            minHeight: '100vh'
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              position: 'sticky',
              top: 0,

              zIndex: 10,

              backdropFilter: 'blur(12px)',

              background:
                'rgba(0,0,0,0.75)',

              borderBottom:
                '1px solid rgba(255,255,255,0.08)',

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
                fontSize: '1.2rem'
              }}
            >
              Ordine #{order.id}
            </Typography>

            <IconButton
              onClick={() => setOpen(false)}
              sx={{ color: '#fff' }}
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

                fontWeight: 'bold',

                textTransform: 'uppercase'
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

                background:
                  'rgba(255,255,255,0.05)',

                border:
                  '1px solid rgba(255,255,255,0.08)',

                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <DeliveryDiningIcon
                sx={{
                  color: '#ff4b2b',
                  fontSize: 34
                }}
              />

              <Box>
                <Typography
                  sx={{
                    color: '#888',
                    fontSize: '0.85rem'
                  }}
                >
                  Orario consegna
                </Typography>

                <Typography
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#fff'
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
                  color: '#777',
                  mb: 1
                }}
              >
                Cliente
              </Typography>

              <Typography sx={{ fontSize: '1.1rem' }}>
                👤 {order.customer?.name}
              </Typography>

              <Typography sx={{ mt: 1, color: '#ccc' }}>
                📞 {order.customer?.phone}
              </Typography>

              <Typography sx={{ mt: 1, color: '#ccc' }}>
                📍 {order.customer?.address}
              </Typography>
            </Box>

            {/* PRODUCTS */}
            <Box sx={{ mt: 4 }}>
              <Typography
                sx={{
                  color: '#777',
                  mb: 2
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

                    background:
                      'rgba(255,255,255,0.05)',

                    border:
                      '1px solid rgba(255,255,255,0.06)'
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
                        color: '#888',
                        fontSize: '0.85rem'
                      }}
                    >
                      Quantità: {item.quantity}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 'bold'
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

                background:
                  'linear-gradient(45deg,#ff416c,#ff4b2b)',

                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem'
                }}
              >
                Totale
              </Typography>

              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.3rem'
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

                    background:
                      'linear-gradient(45deg,#ff9800,#ff5722)'
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

                    background:
                      'linear-gradient(45deg,#4caf50,#2e7d32)'
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
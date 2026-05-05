import { Box, Typography, Button } from '@mui/material'
import { formatPrice } from '../utils/format'

type Props = {
  order: any
  onUpdateStatus: (id: string, status: string) => void
}

export default function OrderCard({ order, onUpdateStatus }: Props) {
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

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: 3,
        mt: 2,
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.4)'
      }}
    >
      <Typography variant="h6" sx={{ color: '#fff' }}>
        Totale: {formatPrice(order.total)}
      </Typography>

      <Typography sx={{ mt: 1, color: '#fff' }}>
        Stato:{' '}
        <span
          style={{
            color: getStatusColor(),
            fontWeight: 'bold'
          }}
        >
          {order.status}
        </span>
      </Typography>

      <Typography sx={{ color: '#ccc' }}>
        {new Date(order.created_at).toLocaleString()}
      </Typography>

      <Typography sx={{ mt: 1, color: '#fff' }}>
        👤 {order.customer?.name}
      </Typography>

      <Typography sx={{ color: '#ccc' }}>
        📍 {order.customer?.address}
      </Typography>

      <Typography sx={{ color: '#ccc' }}>
        📞 {order.customer?.phone}
      </Typography>

      {/* PRODOTTI */}
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ color: '#fff', mb: 1 }}>
          Prodotti:
        </Typography>

        {order.items?.map((item: any) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              py: 1,
              color: '#ccc'
            }}
          >
            <Typography>
              {item.name} x {item.quantity}
            </Typography>

            <Typography>
              {formatPrice(item.price * item.quantity)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* AZIONI */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        {order.status === 'in_preparazione' && (
          <Button
            variant="contained"
            onClick={() =>
              onUpdateStatus(order.id, 'in_consegna')
            }
            sx={{
              background: 'linear-gradient(45deg,#ff9800,#ff5722)'
            }}
          >
            🚚 In consegna
          </Button>
        )}

        {order.status === 'in_consegna' && (
          <Button
            variant="contained"
            onClick={() =>
              onUpdateStatus(order.id, 'consegnato')
            }
            sx={{
              background: 'linear-gradient(45deg,#4caf50,#2e7d32)'
            }}
          >
            ✅ Consegnato
          </Button>
        )}

        {order.status === 'consegnato' && (
          <Typography sx={{ color: '#4caf50' }}>
            ✔ Consegnato
          </Typography>
        )}
      </Box>
    </Box>
  )
}
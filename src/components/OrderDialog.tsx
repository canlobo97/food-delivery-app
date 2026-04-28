import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button
} from '@mui/material'

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
        fullWidth
        maxWidth="sm"
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return
          }
        }}
      >
      <DialogTitle>🚨 Nuovo ordine</DialogTitle>

      <DialogContent>
        {order && (
          <>
            <Typography>
              Cliente: {order.customer?.name}
            </Typography>

            <Typography>
              Indirizzo: {order.customer?.address}
            </Typography>

            <Typography>
              Telefono: {order.customer?.phone}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Prodotti:
              </Typography>

              {order.items?.map((item: any) => (
                <Typography key={item.id}>
                  {item.name} x {item.quantity}
                </Typography>
              ))}
            </Box>

            <Typography sx={{ mt: 2 }}>
              Totale: {order.total}€
            </Typography>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          color="error"
          onClick={() => order && onReject(order)}
        >
          ❌ Rifiuta
        </Button>

        <Button
          variant="contained"
          onClick={() => order && onAccept(order)}
        >
          ✅ Accetta
        </Button>
      </DialogActions>
    </Dialog>
  )
}
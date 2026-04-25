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
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

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
              border: '1px solid #ccc',
              borderRadius: 2
            }}
          >
            <Typography>{item.name}</Typography>

            <Box>    
              <Typography>
               {item.price * item.quantity}€
              </Typography>
            </Box>
            

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Button variant="outlined" onClick={() => dispatch(decrementQuantity(item.id))}>
                  <RemoveIcon />
              </Button>

              <Box>
                {item.quantity}
              </Box>

              <Button variant="outlined" onClick={() => dispatch(incrementQuantity(item.id))}>
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

        <Typography variant="h5" sx={{ mt: 3 }}>
          Totale: {total}€
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          component={Link}
          to="/checkout"
        >
          Paga
        </Button>

        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
          onClick={() => dispatch(clearCart())}
        >
          Svuota carrello
        </Button>
      </>
    )}
  </Container>
)
}
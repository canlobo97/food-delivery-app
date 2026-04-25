import {
  Container,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { clearCart } from '../store/cartSlice'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>()
  const cart = useSelector((state: RootState) => state.cart.items)
  const { user } = useAuth()

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: ''
  })

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
  if (!form.name || !form.address || !form.phone) {
    alert('Compila tutti i campi')
    return
  }

  if (!user) {
    alert('Devi essere loggato')
    return
  }

  const order = {
    user_id: user.id,
    total,
    items: cart,
    customer: form
  }

  const { error } = await supabase
    .from('orders')
    .insert([order])

  if (error) {
    console.error(error)
    alert('Errore nel salvataggio ordine')
    return
  }

  dispatch(clearCart())
  alert('Ordine inviato! 🎉')
  navigate('/')
}

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout 🧾
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Nome"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Indirizzo"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Telefono"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
        />

        <Typography variant="h6">
          Totale: {total}€
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
        >
          Conferma Ordine
        </Button>
      </Box>
    </Container>
  )
}
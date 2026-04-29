import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { clearCart } from '../store/cartSlice'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../utils/format'
import { inputStyles, radioStyles } from '../styles/formStyles'

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>()
  const cart = useSelector((state: RootState) => state.cart.items)
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    payment: ''
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

  const isValid =
    form.name &&
    form.address &&
    form.phone &&
    form.payment

  const handleSubmit = async () => {
    if (!isValid) return

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
    <Container maxWidth="sm" sx={{ mt: 4, pb: 10 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#070000' }}>
        Checkout 🧾
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(0,0,0,0.75)',
          borderRadius: 3,
          p: 3,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
        }}
      >
        {/* INPUT */}
        <TextField
          label="Nome"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          sx={inputStyles}
        />

        <TextField
          label="Indirizzo"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
          sx={inputStyles}
        />

        <TextField
          label="Telefono"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
          sx={inputStyles}
        />

        {/* 💳 RADIO PAYMENT */}
        <FormControl>
          <FormLabel sx={{ color: '#fff', mb: 1 }}>
            Modalità di pagamento
          </FormLabel>

          <RadioGroup
            name="payment"
            value={form.payment}
            onChange={handleChange}
          >
            <FormControlLabel
              value="pickup"
              control={<Radio sx={radioStyles} />}
              label="Ritira al ristorante"
              sx={{ color: '#fff' }}
            />

            <FormControlLabel
              value="cash"
              control={<Radio sx={radioStyles} />}
              label="Paga alla consegna"
              sx={{ color: '#fff' }}
            />

            <FormControlLabel
              value="card"
              control={<Radio sx={radioStyles} />}
              label="Paga con carta"
              sx={{ color: '#fff' }}
            />
          </RadioGroup>
        </FormControl>

        {/* 💰 TOTALE */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7, color: '#fff', fontSize: "1.5rem"}}>
            Totale
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: '#fff' }}
          >
            {formatPrice(total)}
          </Typography>
        </Box>

        {/* CTA */}
        <Button
          variant="contained"
          size="large"
          disabled={!isValid}
          onClick={handleSubmit}
          sx={{
            mt: 2,
            height: 55,
            fontWeight: 'bold',
            textTransform: 'none',

            background: isValid
              ? 'linear-gradient(45deg, #ff416c, #ff4b2b)'
              : 'rgba(255,255,255,0.2)',

            boxShadow: isValid
              ? '0 6px 20px rgba(255,75,43,0.5)'
              : 'none',

            color: '#fff'
          }}
        >
          Conferma Ordine
        </Button>
      </Box>
    </Container>
  )
}
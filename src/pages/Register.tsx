import {
  Container,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { inputStyles } from '../styles/formStyles'
import { useDispatch } from 'react-redux'
import { showToast } from '../store/toastSlice'

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const isValid =
    form.email &&
    form.password.length >= 6 &&
    form.password === form.confirmPassword

    const handleSignup = async () => {
    if (!isValid) return

    const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password
    })

    if (error) {
        dispatch(showToast({
        message: error.message,
        type: 'error'
        }))
        return
    }

    dispatch(showToast({
        message: 'Controlla la tua email 📩',
        type: 'warning'
    }))

    navigate('/login')
    }

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Registrati ✨
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
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          sx={inputStyles}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          sx={inputStyles}
        />

        <TextField
          label="Conferma Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          fullWidth
          sx={inputStyles}
        />

        <Button
          variant="contained"
          size="large"
          disabled={!isValid}
          onClick={handleSignup}
          sx={{
            mt: 2,
            height: 50,
            fontWeight: 'bold',
            textTransform: 'none',
            background: isValid
              ? 'linear-gradient(45deg, #ff416c, #ff4b2b)'
              : 'rgba(255,255,255,0.2)',
            boxShadow: isValid
              ? '0 6px 20px rgba(255,75,43,0.5)'
              : 'none'
          }}
        >
          Registrati
        </Button>
      </Box>
    </Container>
  )
}
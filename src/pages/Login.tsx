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

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      dispatch(showToast({
        message: 'Inserisci email e password',
        type: 'warning'
      }))
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })

    if (error) {
      dispatch(showToast({
        message: error.message,
        type: 'error'
      }))
    } else {
      dispatch(showToast({
        message: 'Login effettuato 🚀',
        type: 'success'
      }))
      navigate('/')
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        
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
          type="email"
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

        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
          sx={{
            mt: 2,
            height: 50,
            fontWeight: 'bold',
            textTransform: 'none',
            background: 'linear-gradient(45deg, #ff416c, #ff4b2b)',
            boxShadow: '0 6px 20px rgba(255,75,43,0.5)'
          }}
        >
          Accedi
        </Button>

        <Button
          variant="text"
          onClick={() => navigate('/register')}
          sx={{ color: '#fff' }}
        >
          Non hai un account? Registrati
        </Button>
      </Box>
    </Container>
  )
}
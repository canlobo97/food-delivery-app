import { Container, Typography, TextField, Button, Box } from '@mui/material'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { inputStyles, panelStyle } from '../styles/formStyles'
import { useDispatch } from 'react-redux'
import { showToast } from '../store/toastSlice'
import { colors, fontFamily } from '../theme/colors'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      dispatch(
        showToast({ message: 'Inserisci email e password', type: 'warning' })
      )
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      dispatch(showToast({ message: error.message, type: 'error' }))
    } else {
      dispatch(showToast({ message: 'Accesso effettuato', type: 'success' }))
      navigate('/')
    }
  }

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: { xs: 4, md: 8 },
        pb: 6,
        px: 2,
        minHeight: '100dvh',
        fontFamily,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 0.5,
          fontSize: '1.75rem',
          textAlign: 'center',
          fontWeight: 800,
          fontFamily,
        }}
      >
        Bentornato
      </Typography>
      <Typography sx={{ mb: 3, color: colors.muted, textAlign: 'center', fontFamily }}>
        Accedi per continuare l&apos;ordine
      </Typography>

      <Box sx={panelStyle}>
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
            mt: 1,
            height: 52,
            fontWeight: 700,
            textTransform: 'none',
            fontFamily,
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
            boxShadow: colors.shadowFab,
          }}
        >
          Accedi
        </Button>
        <Button
          variant="text"
          onClick={() => navigate('/register')}
          sx={{ color: colors.muted, fontWeight: 600, fontFamily }}
        >
          Non hai un account? Registrati
        </Button>
      </Box>
    </Container>
  )
}

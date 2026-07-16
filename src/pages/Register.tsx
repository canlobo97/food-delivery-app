import { Container, Typography, TextField, Button, Box } from '@mui/material'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { inputStyles, panelStyle } from '../styles/formStyles'
import { useDispatch } from 'react-redux'
import { showToast } from '../store/toastSlice'
import { colors, fontFamily } from '../theme/colors'

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const isValid =
    !!form.email &&
    form.password.length >= 6 &&
    form.password === form.confirmPassword

  const handleSignup = async () => {
    if (!isValid) return

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (error) {
      dispatch(showToast({ message: error.message, type: 'error' }))
      return
    }

    dispatch(
      showToast({
        message: 'Controlla la tua email per confermare',
        type: 'warning',
      })
    )
    navigate('/login')
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
        Crea account
      </Typography>
      <Typography
        sx={{ mb: 3, color: colors.muted, textAlign: 'center', fontFamily }}
      >
        Registrati per ordinare più velocemente
      </Typography>

      <Box sx={panelStyle}>
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
          label="Conferma password"
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
            mt: 1,
            height: 52,
            fontWeight: 700,
            textTransform: 'none',
            fontFamily,
            background: isValid
              ? `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`
              : colors.borderStrong,
            boxShadow: isValid ? colors.shadowFab : 'none',
            color: isValid ? '#fff' : colors.muted,
          }}
        >
          Registrati
        </Button>
        <Button
          variant="text"
          onClick={() => navigate('/login')}
          sx={{ color: colors.muted, fontWeight: 600, fontFamily }}
        >
          Hai già un account? Accedi
        </Button>
      </Box>
    </Container>
  )
}

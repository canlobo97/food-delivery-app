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

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert('Inserisci email e password')
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })

    if (error) {
    alert(error.message)
    } else {
    console.log('Login OK', data)
    navigate('/')
    }
  }

    const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password
    })

    if (error) {
        alert(error.message)
        return
    }

    // 👉 CREA PROFILO DOPO SIGNUP
    const user = data.user

    if (user) {
        const { error: profileError } = await supabase
        .from('profiles')
        .insert([
            {
            id: user.id,
            email: user.email,
            role: 'user'
            }
        ])

        if (profileError) {
        console.error(profileError)
        }
    }

    alert('Utente registrato!')
    navigate('/')
    }

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Login 🔐
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
        >
          Accedi
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={handleSignup}
        >
          Registrati
        </Button>
      </Box>
    </Container>
  )
}
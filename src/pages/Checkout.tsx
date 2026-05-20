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
  FormLabel,
  Chip
} from '@mui/material'

import {
  useState,
  useMemo,
  useEffect
} from 'react'

import {
  useSelector,
  useDispatch
} from 'react-redux'

import type {
  RootState,
  AppDispatch
} from '../store/store'

import { clearCart } from '../store/cartSlice'

import { supabase } from '../lib/supabase'

import { useAuth } from '../context/AuthContext'

import { useNavigate } from 'react-router-dom'

import { formatPrice } from '../utils/format'

import {
  inputStyles,
  radioStyles
} from '../styles/formStyles'

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>()

  const cart = useSelector(
    (state: RootState) => state.cart.items
  )

  const { user } = useAuth()

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    payment: ''
  })

  // 🔥 DELIVERY

  const [deliveryMode, setDeliveryMode] =
    useState<'asap' | 'scheduled'>(
      'asap'
    )

  const [selectedSlot, setSelectedSlot] =
    useState('')

  const [disabledSlots, setDisabledSlots] =
    useState<string[]>([])

  // 🔥 GENERATE TIME SLOTS

  const slots = useMemo(() => {
    const arr: string[] = []

    let hour = 18
    let minute = 0

    while (hour < 23) {
      arr.push(
        `${String(hour).padStart(
          2,
          '0'
        )}:${String(minute).padStart(
          2,
          '0'
        )}`
      )

      minute += 10

      if (minute >= 60) {
        minute = 0
        hour++
      }
    }

    return arr
  }, [])

  // 🔥 CHECK SLOT LIMIT

  const isSlotDisabled = async (
    slot: string
  ) => {
    const { data, error } =
      await supabase.rpc(
        'get_orders_count_by_time',
        {
          selected_time: slot
        }
      )

    if (error) {
      console.error(error)

      return false
    }

    return data >= 5
  }

  // 🔥 LOAD DISABLED SLOTS

  useEffect(() => {
    const checkSlots = async () => {
      const disabled: string[] = []

      for (const slot of slots) {
        const blocked =
          await isSlotDisabled(slot)

        if (blocked) {
          disabled.push(slot)
        }
      }

      setDisabledSlots(disabled)
    }

    checkSlots()
  }, [slots])

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    })
  }

  const isValid =
    form.name &&
    form.address &&
    form.phone &&
    form.payment &&
    (deliveryMode === 'asap' ||
      selectedSlot)

  const handleSubmit = async () => {
    if (!isValid) return

    if (!user) {
      alert('Devi essere loggato')
      return
    }

    // 🔥 DOUBLE SECURITY CHECK

    if (
      deliveryMode === 'scheduled'
    ) {
      const blocked =
        await isSlotDisabled(
          selectedSlot
        )

      if (blocked) {
        alert(
          'Questo orario è appena stato occupato 😥'
        )

        return
      }
    }

    const deliveryTimestamp =
      deliveryMode === 'scheduled'
        ? new Date(
            `${new Date()
              .toISOString()
              .split('T')[0]}T${selectedSlot}:00`
          ).toISOString()
        : null

    const order = {
      user_id: user.id,

      total,

      items: cart,

      customer: form,

      asap:
        deliveryMode === 'asap',

      delivery_time:
        deliveryMode === 'asap'
          ? 'Il prima possibile'
          : selectedSlot,

      delivery_timestamp:
        deliveryTimestamp
    }

    const { error } =
      await supabase
        .from('orders')
        .insert([order])

    if (error) {
      console.error(error)

      alert(
        'Errore nel salvataggio ordine'
      )

      return
    }

    dispatch(clearCart())

    alert('Ordine inviato! 🎉')

    navigate('/')
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        pb: 14
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: '#070000'
        }}
      >
        Pagamento 
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,

          backdropFilter:
            'blur(12px)',

          backgroundColor:
            '#1c1c1e',

          borderRadius: 3,

          p: 3,

          border:
            '1px solid rgba(255,255,255,0.1)',

          boxShadow:
            '0 10px 30px rgba(0,0,0,0.4)'
        }}
      >
        {/* INPUTS */}

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

        {/* DELIVERY */}

        <FormControl>
          <FormLabel
            sx={{
              color: '#fff',
              mb: 1
            }}
          >
            Consegna
          </FormLabel>

          <RadioGroup
            value={deliveryMode}
            onChange={(e) =>
              setDeliveryMode(
                e.target.value as
                  | 'asap'
                  | 'scheduled'
              )
            }
          >
            <FormControlLabel
              value="asap"
              control={
                <Radio
                  sx={
                    radioStyles
                  }
                />
              }
              label="⚡ Il prima possibile"
              sx={{
                color: '#fff'
              }}
            />

            <FormControlLabel
              value="scheduled"
              control={
                <Radio
                  sx={
                    radioStyles
                  }
                />
              }
              label="🕒 Scegli orario"
              sx={{
                color: '#fff'
              }}
            />
          </RadioGroup>
        </FormControl>

        {/* TIME SLOTS */}

        {deliveryMode ===
          'scheduled' && (
          <Box>
            <Typography
              sx={{
                color: '#fff',
                mb: 1,
                fontWeight: 700
              }}
            >
              Orari disponibili
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              {slots.map((slot) => {
                const disabled =
                  disabledSlots.includes(
                    slot
                  )

                return (
                  <Chip
                    key={slot}
                    label={
                      disabled
                        ? `${slot} ❌`
                        : slot
                    }
                    clickable={
                      !disabled
                    }
                    disabled={
                      disabled
                    }
                    onClick={() =>
                      setSelectedSlot(
                        slot
                      )
                    }
                    sx={{
                      height: 42,

                      fontWeight: 700,

                      color:
                        selectedSlot ===
                        slot
                          ? '#fff'
                          : '#ddd',

                      background:
                        selectedSlot ===
                        slot
                          ? 'linear-gradient(45deg,#ff416c,#ff4b2b)'
                          : 'rgba(255,255,255,0.08)',

                      border:
                        '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                )
              })}
            </Box>
          </Box>
        )}

        {/* PAYMENT */}

        <FormControl>
          <FormLabel
            sx={{
              color: '#fff',
              mb: 1
            }}
          >
            Modalità di pagamento
          </FormLabel>

          <RadioGroup
            name="payment"
            value={form.payment}
            onChange={
              handleChange
            }
          >
            <FormControlLabel
              value="pickup"
              control={
                <Radio
                  sx={
                    radioStyles
                  }
                />
              }
              label="Ritira al ristorante"
              sx={{
                color: '#fff'
              }}
            />

            <FormControlLabel
              value="cash"
              control={
                <Radio
                  sx={
                    radioStyles
                  }
                />
              }
              label="Paga alla consegna"
              sx={{
                color: '#fff'
              }}
            />

            <FormControlLabel
              value="card"
              control={
                <Radio
                  sx={
                    radioStyles
                  }
                />
              }
              label="Paga con carta"
              sx={{
                color: '#fff'
              }}
            />
          </RadioGroup>
        </FormControl>

        {/* TOTAL */}

        <Box
          sx={{
            mt: 2,
            p: 2,

            borderRadius: 2,

            backgroundColor:
              'rgba(255,255,255,0.05)',

            border:
              '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              opacity: 0.7,
              color: '#fff',
              fontSize:
                '1.2rem'
            }}
          >
            Totale
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight:
                'bold',
              color: '#fff'
            }}
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

            textTransform:
              'none',

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
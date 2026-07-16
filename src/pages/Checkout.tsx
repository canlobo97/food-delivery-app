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
  radioStyles,
  formLabelStyles,
  panelStyle,
} from '../styles/formStyles'

import { colors, fontFamily } from '../theme/colors'

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

  const [submitting, setSubmitting] = useState(false)

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
    cart.length > 0 &&
    form.name &&
    form.address &&
    form.phone &&
    form.payment &&
    (deliveryMode === 'asap' || selectedSlot)

  const mapOrderError = (message: string) => {
    if (message.includes('EMPTY_CART')) return 'Il carrello è vuoto'
    if (message.includes('NOT_AUTHENTICATED')) return 'Devi essere loggato'
    if (message.includes('INVALID_CUSTOMER')) return 'Completa tutti i dati'
    if (message.includes('SLOT_REQUIRED')) return 'Seleziona un orario'
    if (message.includes('PRODUCT_NOT_FOUND')) return 'Un prodotto non è più disponibile'
    if (message.includes('INVALID_QUANTITY')) return 'Quantità non valida'
    return 'Errore nel salvataggio ordine'
  }

  const handleSubmit = async () => {
    if (!isValid || submitting) return

    if (!user) {
      alert('Devi essere loggato')
      return
    }

    if (deliveryMode === 'scheduled') {
      const blocked = await isSlotDisabled(selectedSlot)

      if (blocked) {
        alert('Questo orario è appena stato occupato 😥')
        return
      }
    }

    const deliveryTimestamp =
      deliveryMode === 'scheduled'
        ? new Date(
            `${new Date().toISOString().split('T')[0]}T${selectedSlot}:00`
          ).toISOString()
        : null

    // Solo id/qty/notes — prezzi e total li calcola create_order sul DB
    const payloadItems = cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      notes: item.notes || '',
    }))

    setSubmitting(true)

    const { data, error } = await supabase.rpc('create_order', {
      p_items: payloadItems,
      p_customer: form,
      p_asap: deliveryMode === 'asap',
      p_delivery_time:
        deliveryMode === 'asap' ? null : selectedSlot,
      p_delivery_timestamp: deliveryTimestamp,
    })

    setSubmitting(false)

    if (error) {
      console.error(error)
      alert(mapOrderError(error.message || ''))
      return
    }

    dispatch(clearCart())

    const serverTotal =
      data && typeof data === 'object' && 'total' in data
        ? Number((data as { total: number }).total)
        : total

    alert(`Ordine inviato! Totale ${formatPrice(serverTotal)}`)

    navigate('/')
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        pb: 14,
        fontFamily,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: colors.ink,
          fontWeight: 800,
          fontFamily,
        }}
      >
        Pagamento
      </Typography>

      <Box sx={panelStyle}>
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

        <FormControl>
          <FormLabel sx={{ ...formLabelStyles, mb: 1 }}>
            Consegna
          </FormLabel>

          <RadioGroup
            value={deliveryMode}
            onChange={(e) =>
              setDeliveryMode(
                e.target.value as 'asap' | 'scheduled'
              )
            }
          >
            <FormControlLabel
              value="asap"
              control={<Radio sx={radioStyles} />}
              label="⚡ Il prima possibile"
              sx={{ color: colors.ink, fontFamily }}
            />

            <FormControlLabel
              value="scheduled"
              control={<Radio sx={radioStyles} />}
              label="🕒 Scegli orario"
              sx={{ color: colors.ink, fontFamily }}
            />
          </RadioGroup>
        </FormControl>

        {deliveryMode === 'scheduled' && (
          <Box>
            <Typography
              sx={{
                color: colors.ink,
                mb: 1,
                fontWeight: 700,
                fontFamily,
              }}
            >
              Orari disponibili
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {slots.map((slot) => {
                const disabled = disabledSlots.includes(slot)
                const selected = selectedSlot === slot

                return (
                  <Chip
                    key={slot}
                    label={disabled ? `${slot} ❌` : slot}
                    clickable={!disabled}
                    disabled={disabled}
                    onClick={() => setSelectedSlot(slot)}
                    sx={{
                      height: 42,
                      fontWeight: 700,
                      fontFamily,
                      color: selected ? '#fff' : colors.ink,
                      background: selected
                        ? `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`
                        : colors.bg,
                      border: `1px solid ${selected ? colors.accent : colors.border}`,
                      '&.Mui-disabled': {
                        opacity: 0.45,
                        color: colors.muted,
                      },
                    }}
                  />
                )
              })}
            </Box>
          </Box>
        )}

        <FormControl>
          <FormLabel sx={{ ...formLabelStyles, mb: 1 }}>
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
              sx={{ color: colors.ink, fontFamily }}
            />

            <FormControlLabel
              value="cash"
              control={<Radio sx={radioStyles} />}
              label="Paga alla consegna"
              sx={{ color: colors.ink, fontFamily }}
            />

            <FormControlLabel
              value="card"
              control={<Radio sx={radioStyles} />}
              label="Paga con carta"
              sx={{ color: colors.ink, fontFamily }}
            />
          </RadioGroup>
        </FormControl>

        <Box
          sx={{
            mt: 1,
            p: 2,
            borderRadius: 2,
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.muted,
              fontSize: '1rem',
              fontFamily,
            }}
          >
            Totale
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: colors.ink,
              fontFamily,
            }}
          >
            {formatPrice(total)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          disabled={!isValid || submitting}
          onClick={handleSubmit}
          sx={{
            mt: 1,
            height: 55,
            fontWeight: 700,
            textTransform: 'none',
            fontFamily,
            background: isValid && !submitting
              ? `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`
              : colors.borderStrong,
            boxShadow: isValid && !submitting ? colors.shadowFab : 'none',
            color: '#fff',
            '&.Mui-disabled': {
              color: colors.muted,
              background: colors.bg,
            },
          }}
        >
          {submitting ? 'Invio...' : 'Conferma Ordine'}
        </Button>
      </Box>
    </Container>
  )
}
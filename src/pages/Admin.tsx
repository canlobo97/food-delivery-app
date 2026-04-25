import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { showToast } from '../store/toastSlice'

export default function Admin() {
  const [orders, setOrders] = useState<any[]>([])
  const [filters, setFilters] = useState({
    status: '',
    name: '',
    phone: '',
    date: ''
  })

  const dispatch = useDispatch()

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  )

  // 🔥 UPDATE STATUS
  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) console.error(error)
  }

  const audio = new Audio('/ding.wav')

  // 🔥 FETCH + REALTIME
  useEffect(() => {
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setOrders(data || [])
  }

  fetchOrders()

  const channel = supabase
    .channel('orders-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        console.log('🔥 REALTIME EVENT:', payload)

        if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new, ...prev])

            audio.currentTime = 0
            audio.play().catch(err => console.log(err))

            // 💬 TOAST REDUX
            dispatch(
                showToast({
                message: `Nuovo ordine da ${payload.new.customer?.name}`,
                type: 'success'
                })
            )
        }

        if (payload.eventType === 'UPDATE') {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === payload.new.id ? payload.new : o
            )
          )
        }

        if (payload.eventType === 'DELETE') {
          setOrders((prev) =>
            prev.filter((o) => o.id !== payload.old.id)
          )
        }
      }
    )
    .subscribe((status) => {
      console.log('📡 REALTIME STATUS:', status)
    })

  return () => {
    supabase.removeChannel(channel)
  }
}, [])

  // 🔍 FILTRI
  const filteredOrders = orders.filter((order) => {
    const matchStatus =
      !filters.status || order.status === filters.status

    const matchName =
      !filters.name ||
      order.customer?.name
        ?.toLowerCase()
        .includes(filters.name.toLowerCase())

    const matchPhone =
      !filters.phone ||
      order.customer?.phone?.includes(filters.phone)

    const matchDate =
      !filters.date ||
      new Date(order.created_at)
        .toLocaleDateString()
        .includes(filters.date)

    return matchStatus && matchName && matchPhone && matchDate
  })

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">
        Admin Panel 🔥
      </Typography>

      {/* 📊 STATS */}
      <Box sx={{ display: 'flex', gap: 4, mt: 3 }}>
        <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h6">💸 Entrate totali</Typography>
          <Typography variant="h5">{totalRevenue}€</Typography>
        </Box>

        <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h6">📦 Ordini totali</Typography>
          <Typography variant="h5">{orders.length}</Typography>
        </Box>
      </Box>

      {/* 🔍 FILTRI */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Stato</InputLabel>
          <Select
            value={filters.status}
            label="Stato"
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <MenuItem value="">Tutti</MenuItem>
            <MenuItem value="in_preparazione">In preparazione</MenuItem>
            <MenuItem value="in_consegna">In consegna</MenuItem>
            <MenuItem value="consegnato">Consegnato</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Nome cliente"
          value={filters.name}
          onChange={(e) =>
            setFilters({ ...filters, name: e.target.value })
          }
        />

        <TextField
          label="Telefono"
          value={filters.phone}
          onChange={(e) =>
            setFilters({ ...filters, phone: e.target.value })
          }
        />

        <TextField
          label="Data (gg/mm/aaaa)"
          value={filters.date}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value })
          }
        />
      </Box>

      {/* 📦 LISTA */}
      {filteredOrders.length === 0 ? (
        <Typography sx={{ mt: 2 }}>
          Nessun ordine trovato
        </Typography>
      ) : (
        filteredOrders.map((order) => (
          <Box
            key={order.id}
            sx={{
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 2,
              mt: 2
            }}
          >
            <Typography variant="h6">
              Totale: {order.total}€
            </Typography>

            {/* 🎨 STATO */}
            <Typography sx={{ mt: 1 }}>
              Stato:{' '}
              <span
                style={{
                  color:
                    order.status === 'in_preparazione'
                      ? 'orange'
                      : order.status === 'in_consegna'
                      ? 'blue'
                      : 'green',
                  fontWeight: 'bold'
                }}
              >
                {order.status}
              </span>
            </Typography>

            <Typography>
              Data: {new Date(order.created_at).toLocaleString()}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              Cliente: {order.customer?.name}
            </Typography>

            <Typography>
              Indirizzo: {order.customer?.address}
            </Typography>

            <Typography>
              Telefono: {order.customer?.phone}
            </Typography>

            {/* 🧾 PRODOTTI */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Prodotti:
              </Typography>

              {order.items?.map((item: any) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #eee',
                    py: 1
                  }}
                >
                  <Typography>
                    {item.name} x {item.quantity}
                  </Typography>

                  <Typography>
                    {item.price * item.quantity}€
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* 🔥 BOTTONI STATO */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              {order.status === 'in_preparazione' && (
                <Button
                  variant="contained"
                  onClick={() =>
                    updateStatus(order.id, 'in_consegna')
                  }
                >
                  🚚 Passa a consegna
                </Button>
              )}

              {order.status === 'in_consegna' && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() =>
                    updateStatus(order.id, 'consegnato')
                  }
                >
                  ✅ Segna consegnato
                </Button>
              )}

              {order.status === 'consegnato' && (
                <Typography color="green">
                  ✔ Consegnato
                </Typography>
              )}
            </Box>
          </Box>
        ))
      )}
    </Container>
  )
}
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  SwipeableDrawer
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { useDispatch } from 'react-redux'
import { showToast } from '../store/toastSlice'
import OrderDialog from '../components/OrderDialog'
import { inputStyles, selectStyle } from '../styles/formStyles'
import OrderCard from '../components/OrderCard'
import AdminDashboard from '../components/AdminDashboard'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import MobileSelect from '../components/layout/MobileSelect'

export default function Admin() {
  const [orders, setOrders] = useState<any[]>([])
  const [incomingOrders, setIncomingOrders] = useState<any[]>([])
  const [openFilters, setOpenFilters] = useState(false)

  const [filters, setFilters] = useState({
    status: '',
    name: '',
    phone: '',
    date: ''
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const dispatch = useDispatch()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const updateStatus = async (orderId: string, newStatus: string) => {
    await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
  }

  // 🔊 AUDIO INIT
  useEffect(() => {
    const audio = new Audio('/ding.wav')
    audio.loop = true
    audio.volume = 1
    audioRef.current = audio
  }, [])

  // 🔊 AUDIO CONTROL
  useEffect(() => {
    if (!audioRef.current) return

    if (incomingOrders.length === 0) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    } else if (audioRef.current.paused) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }, [incomingOrders])

  const currentOrder =
    incomingOrders.length > 0
      ? incomingOrders[incomingOrders.length - 1]
      : null

  // 🔥 FETCH + REALTIME
  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      const all = data || []

      setIncomingOrders(
        all.filter((o) => o.status === 'in_elaborazione')
      )

      setOrders(
        all.filter((o) => o.status !== 'in_elaborazione')
      )
    }

    fetchOrders()

    const channel = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new

            if (newOrder.status === 'in_elaborazione') {
              setIncomingOrders((prev) => [newOrder, ...prev])
            } else {
              setOrders((prev) => [newOrder, ...prev])
            }

            dispatch(
              showToast({
                message: `Nuovo ordine da ${newOrder.customer?.name}`,
                type: 'success'
              })
            )
          }

          if (payload.eventType === 'UPDATE') {
            const updated = payload.new

            setOrders((prev) =>
              prev.map((o) =>
                o.id === updated.id ? updated : o
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
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleAccept = async (order: any) => {
    await updateStatus(order.id, 'in_preparazione')
    setIncomingOrders((prev) =>
      prev.filter((o) => o.id !== order.id)
    )
  }

  const handleReject = async (order: any) => {
    await updateStatus(order.id, 'cancellato')
    setIncomingOrders((prev) =>
      prev.filter((o) => o.id !== order.id)
    )
  }

  // 🔍 FILTRI
  const filteredOrders = orders.filter((order) => {
    return (
      (!filters.status || order.status === filters.status) &&
      (!filters.name ||
        order.customer?.name
          ?.toLowerCase()
          .includes(filters.name.toLowerCase())) &&
      (!filters.phone ||
        order.customer?.phone?.includes(filters.phone)) &&
      (!filters.date ||
        new Date(order.created_at)
          .toLocaleDateString()
          .includes(filters.date))
    )
  })

  return (
    <Container sx={{ mt: 4, pb: 10 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4">
          Admin Panel 🔥
        </Typography>

        <IconButton
          onClick={() => setOpenFilters(true)}
          sx={{
            background: 'linear-gradient(45deg,#ff416c,#ff4b2b)',
            color: '#fff'
          }}
        >
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* 🔔 NOTIFICA */}
      {incomingOrders.length > 0 && (
        <Typography sx={{ mt: 2, color: '#ff4b2b' }}>
          🔔 {incomingOrders.length} nuovi ordini
        </Typography>
      )}

      {/* 📊 DASHBOARD */}
      <AdminDashboard orders={orders} />

      {/* 📦 ORDINI */}
      {filteredOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onUpdateStatus={updateStatus}
        />
      ))}

      {/* 🔥 FILTRI - SWIPEABLE */}
      <SwipeableDrawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        onOpen={() => {}}
        disableSwipeToOpen={true}
        swipeAreaWidth={20}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: isMobile ? 20 : 0,
              borderTopRightRadius: isMobile ? 20 : 0,
              overflowX: 'hidden'
            }
          }
        }}
      >
          <Box
            sx={{
              width: '100%',
              maxWidth: isMobile ? '100%' : 300,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              background: '#1c1c1e',
              height: isMobile ? 'auto' : '100%',
              color: '#fff',

              overflowX: 'hidden',
              touchAction: 'pan-y',
              boxSizing: 'border-box',
              paddingBottom: "3rem"
            }}
          >
          {/* HANDLE MOBILE */}
          {isMobile && (
            <Box
              sx={{
                width: 80,
                height: 6,
                background: 'rgba(255,255,255,0.4)',
                borderRadius: 10,
                alignSelf: 'center',
                mb: 2
              }}
            />
          )}

          <Typography variant="h6">
            Filtri 🔍
          </Typography>

          {isMobile ? (
            <MobileSelect
              label="Stato"
              value={filters.status}
              onChange={(val) =>
                setFilters({ ...filters, status: val })
              }
              options={[
                { label: 'Tutti', value: '' },
                { label: 'Preparazione', value: 'in_preparazione' },
                { label: 'Consegna', value: 'in_consegna' },
                { label: 'Consegnato', value: 'consegnato' },
                { label: 'Cancellato', value: 'cancellato' }
              ]}
            />
          ) : (
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Stato</InputLabel>

              <Select
                value={filters.status}
                label="Stato"
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value
                  })
                }
                sx={selectStyle}
                MenuProps={{
                  slotProps: {
                    paper: {
                      sx: {
                        backgroundColor: '#1c1c1e',
                        color: '#fff'
                      }
                    }
                  }
                }}
              >
                <MenuItem value="">Tutti</MenuItem>
                <MenuItem value="in_preparazione">Preparazione</MenuItem>
                <MenuItem value="in_consegna">Consegna</MenuItem>
                <MenuItem value="consegnato">Consegnato</MenuItem>
                <MenuItem value="cancellato">Cancellato</MenuItem>
              </Select>
            </FormControl>
          )}

          <TextField
            label="Nome"
            value={filters.name}
            onChange={(e) =>
              setFilters({ ...filters, name: e.target.value })
            }
            sx={inputStyles}
          />

          <TextField
            label="Telefono"
            value={filters.phone}
            onChange={(e) =>
              setFilters({ ...filters, phone: e.target.value })
            }
            sx={inputStyles}
          />

          <TextField
            label="Data"
            value={filters.date}
            onChange={(e) =>
              setFilters({ ...filters, date: e.target.value })
            }
            sx={inputStyles}
          />

          {/* ACTIONS */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() =>
                setFilters({
                  status: '',
                  name: '',
                  phone: '',
                  date: ''
                })
              }
            >
              Reset
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={() => setOpenFilters(false)}
              sx={{
                background: 'linear-gradient(45deg,#ff416c,#ff4b2b)'
              }}
            >
              Risultati {filteredOrders.length}
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>

      {/* 🔥 POPUP ORDINI */}
      <OrderDialog
        order={currentOrder}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </Container>
  )
}
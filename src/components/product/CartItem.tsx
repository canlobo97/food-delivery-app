import { Box, Typography, IconButton, TextField } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch } from 'react-redux'
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  updateNote,
} from '../../store/cartSlice'
import type { AppDispatch } from '../../store/store'
import { useState } from 'react'
import { formatPrice } from '../../utils/format'
import { colors, fontFamily } from '../../theme/colors'

export default function CartItem({ item }: any) {
  const dispatch = useDispatch<AppDispatch>()
  const [editing, setEditing] = useState(false)
  const [noteValue, setNoteValue] = useState(item.notes || '')

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        mb: 1.5,
        p: 1.5,
        borderRadius: 3,
        bgcolor: colors.surface,
        color: colors.ink,
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
        fontFamily,
        transition: 'transform 0.15s ease',
        '&:active': { transform: 'scale(0.99)' },
      }}
    >
      <Box
        component="img"
        src={item.image || '/placeholder.png'}
        alt={item.name}
        sx={{
          width: 80,
          height: 80,
          borderRadius: 2.5,
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.25, fontFamily }}
            >
              {item.name}
            </Typography>

            {editing ? (
              <TextField
                fullWidth
                size="small"
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                onBlur={() => {
                  dispatch(updateNote({ id: item.id, notes: noteValue }))
                  setEditing(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    dispatch(updateNote({ id: item.id, notes: noteValue }))
                    setEditing(false)
                  }
                }}
                placeholder="Aggiungi una nota"
                autoFocus
                sx={{
                  mt: 0.75,
                  '& .MuiInputBase-root': {
                    backgroundColor: colors.bg,
                    borderRadius: 2,
                  },
                }}
              />
            ) : (
              <Typography
                onClick={() => setEditing(true)}
                sx={{
                  fontSize: '0.85rem',
                  color: colors.muted,
                  mt: 0.5,
                  cursor: 'pointer',
                  fontFamily,
                }}
              >
                {item.notes ? item.notes : 'Aggiungi nota'}
              </Typography>
            )}
          </Box>

          <Typography sx={{ fontWeight: 800, fontSize: '1rem', whiteSpace: 'nowrap', fontFamily }}>
            {formatPrice(item.price * item.quantity)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: colors.bg,
              borderRadius: 999,
              px: 0.5,
              border: `1px solid ${colors.border}`,
            }}
          >
            <IconButton
              size="small"
              onClick={() => dispatch(decrementQuantity(item.id))}
              sx={{ color: colors.ink }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 700, fontFamily }}>
              {item.quantity}
            </Typography>
            <IconButton
              size="small"
              onClick={() => dispatch(incrementQuantity(item.id))}
              sx={{ color: colors.ink }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          <IconButton
            onClick={() => dispatch(removeFromCart(item.id))}
            aria-label="Rimuovi"
            sx={{ color: colors.accent }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

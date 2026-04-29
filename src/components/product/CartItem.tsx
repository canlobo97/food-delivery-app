import { Box, Typography, IconButton, TextField } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch } from 'react-redux'
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  updateNote
} from '../../store/cartSlice'
import type { AppDispatch } from '../../store/store'
import { useState } from 'react'

export default function CartItem({ item }: any) {
  const dispatch = useDispatch<AppDispatch>()

  const [editing, setEditing] = useState(false)
  const [noteValue, setNoteValue] = useState(item.notes || '')

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 2,
        p: 1.5,
        borderRadius: 3,

        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(0,0,0,0.75)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',

        transition: 'all 0.2s ease',

        '&:active': {
          transform: 'scale(0.98)'
        }
      }}
    >
      {/* 🖼 IMMAGINE */}
      <Box
        component="img"
        src={item.img || '/placeholder.png'}
        alt={item.name}
        sx={{
          width: 80,
          height: 80,
          borderRadius: 3,
          objectFit: 'cover'
        }}
      />

      {/* 📄 CONTENUTO */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* 🔝 NOME + PREZZO */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: 1.2
              }}
            >
              {item.name}
            </Typography>

            {/* 📝 NOTE */}
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
                placeholder="nota"
                autoFocus
                sx={{
                    mt: 0.5,

                    '& .MuiInputBase-root': {
                    backgroundColor: '#fff', // 🔥 sfondo bianco
                    borderRadius: 2
                    },

                    '& .MuiInputBase-input': {
                    color: '#000' // 🔥 testo nero
                    },

                    '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none' // 🔥 niente bordo brutto
                    }
                }}
                />
            ) : (
              <Typography
                onClick={() => setEditing(true)}
                sx={{
                  fontSize: '1rem',
                  opacity: 0.7,
                  mt: 0.5,
                  cursor: 'pointer'
                }}
              >
                {item.notes ? `📝 ${item.notes}` : '➕ Aggiungi nota'}
              </Typography>
            )}
          </Box>

          {/* 💰 PREZZO */}
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              ml: 1
            }}
          >
            {item.price * item.quantity}€
          </Typography>
        </Box>

        {/* 🔻 CONTROLLI */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1
          }}
        >
          {/* ➖ ➕ */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 5,
              px: 1
            }}
          >
            <IconButton
              size="small"
              onClick={() => dispatch(decrementQuantity(item.id))}
              sx={{ color: '#fff' }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

            <Typography sx={{ minWidth: 20, textAlign: 'center' }}>
              {item.quantity}
            </Typography>

            <IconButton
              size="small"
              onClick={() => dispatch(incrementQuantity(item.id))}
              sx={{ color: '#fff' }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* 🗑 REMOVE */}
          <IconButton
            onClick={() => dispatch(removeFromCart(item.id))}
            sx={{
              color: '#ff4b2b'
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}
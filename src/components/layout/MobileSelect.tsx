import { useState } from 'react'
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

type Option = {
  label: string
  value: string
}

type Props = {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
}

export default function MobileSelect({
  label,
  value,
  options,
  onChange
}: Props) {
  const [open, setOpen] = useState(false)

  const selectedLabel =
    options.find((o) => o.value === value)?.label || 'Seleziona'

  return (
    <>
      {/* 🔘 FAKE SELECT */}
      <Box
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: '#fff',
          borderRadius: 2,
          px: 2,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          border: '1px solid rgba(0,0,0,0.2)'
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 12, color: '#666' }}>
            {label}
          </Typography>

          <Typography sx={{ fontWeight: 'bold', color: '#000' }}>
            {selectedLabel}
          </Typography>
        </Box>

        <ExpandMoreIcon sx={{ color: '#000' }} />
      </Box>

      {/* 📱 BOTTOM SHEET */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: '#1c1c1e',
            color: '#fff',
            pb: 3
          }
        }}
      >
        {/* 🔝 handle */}
        <Box
          sx={{
            width: 40,
            height: 4,
            backgroundColor: '#666',
            borderRadius: 10,
            mx: 'auto',
            my: 2
          }}
        />

        <Typography sx={{ px: 2, mb: 1, opacity: 0.7 }}>
          {label}
        </Typography>

        <List>
          {options.map((opt) => (
            <ListItemButton
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 1,
                background:
                  value === opt.value
                    ? 'linear-gradient(45deg,#ff416c,#ff4b2b)'
                    : 'transparent'
              }}
            >
              <ListItemText
                primary={
                    <Typography
                    sx={{
                        fontWeight: value === opt.value ? 'bold' : 'normal'
                    }}
                    >
                    {opt.label}
                    </Typography>
                }
                />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  )
}
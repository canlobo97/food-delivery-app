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
import { colors, fontFamily } from '../../theme/colors'

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
          backgroundColor: colors.surface,
          borderRadius: 2,
          px: 2,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          border: `1px solid ${colors.borderStrong}`,
          fontFamily,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 12, color: colors.muted, fontFamily }}>
            {label}
          </Typography>

          <Typography sx={{ fontWeight: 'bold', color: colors.ink, fontFamily }}>
            {selectedLabel}
          </Typography>
        </Box>

        <ExpandMoreIcon sx={{ color: colors.ink }} />
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
            backgroundColor: colors.surface,
            color: colors.ink,
            pb: 3,
            fontFamily,
          }
        }}
      >
        {/* 🔝 handle */}
        <Box
          sx={{
            width: 40,
            height: 4,
            backgroundColor: colors.borderStrong,
            borderRadius: 10,
            mx: 'auto',
            my: 2
          }}
        />

        <Typography sx={{ px: 2, mb: 1, color: colors.muted, fontFamily }}>
          {label}
        </Typography>

        <List>
          {options.map((opt) => {
            const selected = value === opt.value

            return (
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
                  background: selected
                    ? `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`
                    : 'transparent',
                  color: selected ? '#fff' : colors.ink,
                  '&:hover': {
                    background: selected
                      ? `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`
                      : colors.bg,
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontWeight: selected ? 'bold' : 'normal',
                        fontFamily,
                        color: 'inherit',
                      }}
                    >
                      {opt.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            )
          })}
        </List>
      </Drawer>
    </>
  )
}

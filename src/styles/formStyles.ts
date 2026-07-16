import { colors } from '../theme/colors'

export const inputStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: colors.surface,
    borderRadius: '14px',

    '& fieldset': {
      borderColor: colors.borderStrong,
    },

    '&:hover fieldset': {
      borderColor: colors.accent,
    },

    '&.Mui-focused fieldset': {
      borderColor: colors.accent,
      borderWidth: '2px',
    },
  },

  '& .MuiOutlinedInput-input': {
    color: colors.ink,
  },

  '& .MuiInputLabel-root': {
    color: colors.muted,
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: colors.accent,
  },
}

export const radioStyles = {
  color: colors.muted,

  '&.Mui-checked': {
    color: colors.accent,
  },
}

export const formLabelStyles = {
  color: colors.ink,
  fontWeight: 700,

  '&.Mui-focused': {
    color: colors.accent,
  },
}

export const cardStyle = {
  p: 2,
  borderRadius: 3,
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  boxShadow: colors.shadow,
  color: colors.ink,
}

export const orderCard = {
  mt: 3,
  p: 3,
  borderRadius: 3,
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  boxShadow: colors.shadow,
  color: colors.ink,
}

export const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${colors.border}`,
  py: 1,
}

export const selectStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: colors.surface,
    borderRadius: '14px',

    '& fieldset': {
      borderColor: colors.borderStrong,
    },

    '&:hover fieldset': {
      borderColor: colors.accent,
    },

    '&.Mui-focused fieldset': {
      borderColor: colors.accent,
      borderWidth: '2px',
    },
  },

  '& .MuiOutlinedInput-root.Mui-focused': {
    outline: 'none',
  },

  '& .MuiOutlinedInput-root:focus-within': {
    outline: 'none',
  },

  '& .MuiSelect-select': {
    color: colors.ink,
    backgroundColor: colors.surface,
  },

  '& .MuiSelect-icon': {
    color: colors.ink,
  },

  '& .MuiInputLabel-root': {
    color: colors.muted,
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: colors.accent,
  },
}

export const ctaStyle = {
  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
  color: '#fff',
  fontWeight: 'bold',
  textTransform: 'none',
  borderRadius: 2,
  boxShadow: colors.shadowFab,
}

export const panelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  backgroundColor: colors.surface,
  borderRadius: 3,
  p: 3,
  border: `1px solid ${colors.border}`,
  boxShadow: colors.shadow,
} as const

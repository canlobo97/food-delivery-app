export const inputStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',

    '& fieldset': {
      borderColor: 'rgba(0,0,0,0.2)'
    },

    '&:hover fieldset': {
      borderColor: '#ff4b2b'
    },

    '&.Mui-focused fieldset': {
      borderColor: '#ff4b2b',
      borderWidth: '2px'
    }
  },

  '& .MuiOutlinedInput-input': {
    color: '#000'
  },

  '& .MuiInputLabel-root': {
    color: '#000'
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ff4b2b'
  }
}

export const radioStyles = {
  color: '#fff',

  '&.Mui-checked': {
    color: '#ff4b2b'
  }
}

export const formLabelStyles = {
  color: '#fff',

  '&.Mui-focused': {
    color: '#ff4b2b'
  }
}


export const cardStyle = {
  p: 2,
  borderRadius: 3,
  backgroundColor: 'rgba(8, 0, 0, 0.05)',
  border: '1px solid rgba(9, 0, 0, 0.1)',
  color: '#090000'
}

export const orderCard = {
  mt: 3,
  p: 3,
  borderRadius: 3,
  backgroundColor: 'rgba(0,0,0,0.7)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff'
}

export const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  py: 1
}

export const selectStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',

    '& fieldset': {
      borderColor: 'rgba(0,0,0,0.2)'
    },

    '&:hover fieldset': {
      borderColor: '#ff4b2b'
    },

    '&.Mui-focused fieldset': {
      borderColor: '#ff4b2b',
      borderWidth: '2px'
    }
  },

  // 🔥 rimuove COMPLETAMENTE il blu del browser
  '& .MuiOutlinedInput-root.Mui-focused': {
    outline: 'none'
  },

  

  // 🔥 fix extra per alcuni browser
  '& .MuiOutlinedInput-root:focus-within': {
    outline: 'none'
  },

  // 🔥 testo
  '& .MuiSelect-select': {
    color: '#000',
    backgroundColor: '#fff'
  },

  // 🔥 icona
  '& .MuiSelect-icon': {
    color: '#000'
  },

  // 🔥 label
  '& .MuiInputLabel-root': {
    color: '#000'
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ff4b2b'
  }
}

export const ctaStyle = {
  background: 'linear-gradient(45deg, #ff416c, #ff4b2b)',
  color: '#070000',
  fontWeight: 'bold',
  textTransform: 'none',
  borderRadius: 2,
  boxShadow: '0 6px 20px rgba(255,75,43,0.5)'
}
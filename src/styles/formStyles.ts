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
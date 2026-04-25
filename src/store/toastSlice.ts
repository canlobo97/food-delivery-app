import { createSlice } from '@reduxjs/toolkit'

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    open: false,
    message: '',
    type: 'success'
  },
  reducers: {
    showToast: (state, action) => {
      state.open = true
      state.message = action.payload.message
      state.type = action.payload.type || 'success'
    },
    hideToast: (state) => {
      state.open = false
    }
  }
})

export const { showToast, hideToast } = toastSlice.actions
export default toastSlice.reducer
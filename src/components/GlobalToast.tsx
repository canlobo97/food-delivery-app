import { Snackbar, Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { hideToast } from '../store/toastSlice'

export default function GlobalToast() {
  const dispatch = useDispatch()
  const toast = useSelector((state: RootState) => state.toast)

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={3000}
      onClose={() => dispatch(hideToast())}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity={toast.type as any}
        variant="filled"
        onClose={() => dispatch(hideToast())}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  )
}
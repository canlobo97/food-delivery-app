import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import toastReducer from './toastSlice'

// 🔹 carica dal localStorage
function loadCart() {
  try {
    const data = localStorage.getItem('cart')
    return data ? JSON.parse(data) : { items: [] }
  } catch {
    return { items: [] }
  }
}

// 🔹 salva nel localStorage
function saveCart(state: any) {
  try {
    localStorage.setItem('cart', JSON.stringify(state.cart))
  } catch {}
}

// 🔹 stato iniziale
const preloadedState = {
  cart: loadCart()
}

// 🔹 store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    toast: toastReducer
  },
  preloadedState
})

// 🔹 salva ogni volta che cambia
store.subscribe(() => {
  saveCart(store.getState())
})

// tipi TS
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
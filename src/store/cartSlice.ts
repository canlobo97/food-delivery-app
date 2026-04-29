import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type Product = {
  id: number
  name: string
  price: number
  image?: string
  notes?: string
}

type CartItem = Product & {
  quantity: number
}

type CartState = {
  items: CartItem[]
}

const initialState: CartState = {
  items: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      )

      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({
          ...action.payload,
          notes: action.payload.notes || '',
          quantity: 1
        })
      }
    },

    // NUOVA ACTION PER NOTE DAL CARRELLO
    updateNote: (
      state,
      action: PayloadAction<{ id: number; notes: string }>
    ) => {
      const item = state.items.find(i => i.id === action.payload.id)
      if (item) {
        item.notes = action.payload.notes
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      )
    },

    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.id === action.payload)
      if (item) item.quantity += 1
    },

    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.id === action.payload)
      if (item && item.quantity > 1) {
        item.quantity -= 1
      }
    },

    clearCart: (state) => {
      state.items = []
    }
  }
})

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  updateNote // 👈 IMPORTANTISSIMO
} = cartSlice.actions

export default cartSlice.reducer
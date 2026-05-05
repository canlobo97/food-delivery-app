import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/layout/Navbar'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/control/ProtectedRoute'
import Admin from './pages/Admin'
import AdminRoute from './components/control/AdminRoute'
import GlobalToast from './components/GlobalToast'
import InstallPWA from './components/InstallPWA'
import FloatingCart from './components/FloatingCart'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>
      <GlobalToast />
      <InstallPWA />
      <FloatingCart />
    </>
  )
}

export default App
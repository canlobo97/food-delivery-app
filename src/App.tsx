import Login from './pages/Login'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/control/ProtectedRoute'
import Admin from './pages/Admin'
import AdminRoute from './components/control/AdminRoute'
import GlobalToast from './components/GlobalToast'
import InstallPWA from './components/InstallPWA'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
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
    </>
  )
}

export default App
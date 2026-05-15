import {
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
  Button,
  useMediaQuery
} from '@mui/material'

import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function Navbar() {
  const isMobile = useMediaQuery('(max-width:768px)')

  const location = useLocation()
  const navigate = useNavigate()

  const { user, role } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/menu')
  }

  const currentTab = (() => {
    if (location.pathname.includes('/cart')) return 'cart'
    if (location.pathname.includes('/login')) return 'login'
    if (location.pathname.includes('/admin')) return 'admin'

    return 'menu'
  })()

  return (
    <>
      {/* DESKTOP NAVBAR */}
      {!isMobile && (
        <>
          <AppBar
            position="sticky"
            sx={{
              backdropFilter: 'blur(10px)',
              background: 'rgba(0,0,0,0.88)',
              borderBottom:
                '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Toolbar
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                minHeight: 72
              }}
            >
              {/* LOGO */}
              <Typography
                component={Link}
                to="/menu"
                sx={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '1.6rem',
                  fontWeight: 'bold'
                }}
              >
                EnjoyEat 🍔
              </Typography>

              {/* NAVIGATION */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                <Button
                  startIcon={<RestaurantMenuIcon />}
                  component={Link}
                  to="/menu"
                  sx={desktopButtonStyle}
                >
                  Menu
                </Button>

                <Button
                  startIcon={<ShoppingCartIcon />}
                  component={Link}
                  to="/cart"
                  sx={desktopButtonStyle}
                >
                  Carrello
                </Button>

                {role === 'admin' && (
                  <Button
                    startIcon={
                      <AdminPanelSettingsIcon />
                    }
                    component={Link}
                    to="/admin"
                    sx={desktopButtonStyle}
                  >
                    Admin
                  </Button>
                )}

                {user ? (
                  <Button
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={desktopButtonStyle}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    startIcon={<LoginIcon />}
                    component={Link}
                    to="/login"
                    sx={desktopButtonStyle}
                  >
                    Login
                  </Button>
                )}
              </Box>
            </Toolbar>
          </AppBar>
        </>
      )}

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,

            
            pb: 'max(env(safe-area-inset-bottom), 18px)',

            backdropFilter: 'blur(12px)',
            background: 'rgba(0,0,0,0.94)',

            borderTop:
              '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <BottomNavigation
            value={currentTab}
            showLabels
            sx={{
              background: 'transparent',
              height: 55
            }}
          >
            <BottomNavigationAction
              label="Menu"
              value="menu"
              icon={<RestaurantMenuIcon />}
              onClick={() => navigate('/menu')}
              sx={mobileButtonStyle}
            />

            <BottomNavigationAction
              label="Carrello"
              value="cart"
              icon={<ShoppingCartIcon />}
              onClick={() => navigate('/cart')}
              sx={mobileButtonStyle}
            />

            {role === 'admin' && (
              <BottomNavigationAction
                label="Admin"
                value="admin"
                icon={<AdminPanelSettingsIcon />}
                onClick={() => navigate('/admin')}
                sx={mobileButtonStyle}
              />
            )}

            {user ? (
              <BottomNavigationAction
                label="Logout"
                value="logout"
                icon={<LogoutIcon />}
                onClick={handleLogout}
                sx={mobileButtonStyle}
              />
            ) : (
              <BottomNavigationAction
                label="Login"
                value="login"
                icon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={mobileButtonStyle}
              />
            )}
          </BottomNavigation>
        </Paper>
      )}
    </>
  )
}

const desktopButtonStyle = {
  color: '#fff',
  fontWeight: 700,
  textTransform: 'none',
  borderRadius: '999px',
  px: 2,
  py: 1,

  '&:hover': {
    background:
      'rgba(255,255,255,0.08)'
  }
}

const mobileButtonStyle = {
  color: '#fff',
  pt: 1,

  '&.Mui-selected': {
    color: '#ff4b2b'
  }
}
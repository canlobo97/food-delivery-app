import {
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
  Button,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'

import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { colors, fontFamily } from '../../theme/colors'

export default function Navbar() {
  const isMobile = useMediaQuery('(max-width:768px)')

  const location = useLocation()
  const navigate = useNavigate()

  const { user, role } = useAuth()
  const [logoutOpen, setLogoutOpen] = useState(false)

  const confirmLogout = async () => {
    setLogoutOpen(false)
    await supabase.auth.signOut()
    navigate('/menu')
  }

  const currentTab = (() => {
    if (location.pathname.includes('/cart')) return 'cart'
    if (location.pathname.includes('/login')) return 'login'
    if (location.pathname.includes('/register')) return 'login'
    if (location.pathname.includes('/admin')) return 'admin'
    if (location.pathname.includes('/checkout')) return 'cart'
    return 'menu'
  })()

  const hideBottomNav =
    location.pathname.includes('/checkout') ||
    location.pathname.includes('/login') ||
    location.pathname.includes('/register')

  return (
    <>
      {isMobile && (
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: colors.navBg,
            backdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${colors.border}`,
            color: colors.ink,
            pt: 'env(safe-area-inset-top)',
            fontFamily,
          }}
        >
          <Toolbar sx={{ minHeight: 56, px: 2, justifyContent: 'space-between' }}>
            <Typography
              component={Link}
              to="/menu"
              sx={{
                color: colors.ink,
                textDecoration: 'none',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                fontFamily,
              }}
            >
              Enjoy
              <Box component="span" sx={{ color: colors.accent }}>
                Eat
              </Box>
            </Typography>

            {role === 'admin' && (
              <Button
                size="small"
                startIcon={<AdminPanelSettingsIcon />}
                component={Link}
                to="/admin"
                sx={{ color: colors.muted, fontWeight: 600, fontFamily }}
              >
                Admin
              </Button>
            )}
          </Toolbar>
        </AppBar>
      )}

      {!isMobile && (
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: colors.navBg,
            backdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${colors.border}`,
            color: colors.ink,
            fontFamily,
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              minHeight: 64,
              maxWidth: 1200,
              width: '100%',
              mx: 'auto',
              px: 2,
            }}
          >
            <Typography
              component={Link}
              to="/menu"
              sx={{
                color: colors.ink,
                textDecoration: 'none',
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                fontFamily,
              }}
            >
              Enjoy
              <Box component="span" sx={{ color: colors.accent }}>
                Eat
              </Box>
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Button
                startIcon={<RestaurantMenuIcon />}
                component={Link}
                to="/menu"
                sx={desktopBtn(currentTab === 'menu')}
              >
                Menu
              </Button>

              <Button
                startIcon={<ShoppingCartIcon />}
                component={Link}
                to="/cart"
                sx={desktopBtn(currentTab === 'cart')}
              >
                Carrello
              </Button>

              {role === 'admin' && (
                <Button
                  startIcon={<AdminPanelSettingsIcon />}
                  component={Link}
                  to="/admin"
                  sx={desktopBtn(currentTab === 'admin')}
                >
                  Admin
                </Button>
              )}

              {user ? (
                <Button
                  startIcon={<LogoutIcon />}
                  onClick={() => setLogoutOpen(true)}
                  sx={desktopBtn(false)}
                >
                  Esci
                </Button>
              ) : (
                <Button
                  startIcon={<PersonOutlinedIcon />}
                  component={Link}
                  to="/login"
                  sx={desktopBtn(currentTab === 'login')}
                >
                  Accedi
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {isMobile && !hideBottomNav && (
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            pb: 'max(env(safe-area-inset-bottom), 8px)',
            bgcolor: colors.navBg,
            backdropFilter: 'blur(16px)',
            borderTop: `1px solid ${colors.border}`,
            borderRadius: 0,
            fontFamily,
          }}
        >
          <BottomNavigation
            value={currentTab}
            showLabels
            sx={{ bgcolor: 'transparent', height: 56 }}
          >
            <BottomNavigationAction
              label="Menu"
              value="menu"
              icon={<RestaurantMenuIcon />}
              onClick={() => navigate('/menu')}
              sx={mobileBtn}
            />
            <BottomNavigationAction
              label="Carrello"
              value="cart"
              icon={<ShoppingCartIcon />}
              onClick={() => navigate('/cart')}
              sx={mobileBtn}
            />
            {role === 'admin' && (
              <BottomNavigationAction
                label="Admin"
                value="admin"
                icon={<AdminPanelSettingsIcon />}
                onClick={() => navigate('/admin')}
                sx={mobileBtn}
              />
            )}
            {user ? (
              <BottomNavigationAction
                label="Esci"
                value="logout"
                icon={<LogoutIcon />}
                onClick={() => setLogoutOpen(true)}
                sx={mobileBtn}
              />
            ) : (
              <BottomNavigationAction
                label="Account"
                value="login"
                icon={<PersonOutlinedIcon />}
                onClick={() => navigate('/login')}
                sx={mobileBtn}
              />
            )}
          </BottomNavigation>
        </Paper>
      )}

      <Dialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 0.5,
            fontFamily,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontFamily, pb: 1 }}>
          Uscire dall&apos;account?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: colors.muted, fontFamily }}>
            Sei sicuro di voler fare logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setLogoutOpen(false)}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              color: colors.ink,
              fontFamily,
            }}
          >
            Annulla
          </Button>
          <Button
            variant="contained"
            onClick={confirmLogout}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontFamily,
              bgcolor: colors.accent,
              boxShadow: 'none',
              '&:hover': { bgcolor: colors.accentDark },
            }}
          >
            Esci
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function desktopBtn(active: boolean) {
  return {
    color: active ? colors.accent : colors.ink,
    fontWeight: 700,
    textTransform: 'none' as const,
    borderRadius: '999px',
    px: 2,
    py: 1,
    fontFamily,
    bgcolor: active ? colors.accentSoft : 'transparent',
    '&:hover': { bgcolor: colors.accentSoft },
  }
}

const mobileBtn = {
  color: colors.muted,
  pt: 1,
  fontFamily,
  '&.Mui-selected': { color: colors.accent },
  '& .MuiBottomNavigationAction-label': {
    fontSize: '0.7rem',
    fontWeight: 600,
  },
}

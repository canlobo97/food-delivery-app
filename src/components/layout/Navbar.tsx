import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  ListItemIcon
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const { user, role } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setOpen(false)
  }

  return (
    <>
      {/* 🔥 NAVBAR */}
      <AppBar
        position="fixed"
        sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0,0,0,0.8)'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* LOGO */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontSize: { xs: '1.2rem', md: '1.6rem' } // 🔥 più grande desktop
            }}
          >
            EnjoyEat 🍔
          </Typography>

          {/* HAMBURGER */}
          <IconButton
            color="inherit"
            onClick={() => setOpen(true)}
            sx={{
              transform: { md: 'scale(1.3)' } // 🔥 icona più grande desktop
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 🔥 SPACER */}
      <Toolbar />

      {/* 🔥 OVERLAY BLUR */}
      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1200,
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(0,0,0,0.4)',
            opacity: open ? 1 : 0,
            transition: 'all 0.3s ease'
          }}
        />
      )}

      {/* 📱 DRAWER */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        transitionDuration={300}
        slotProps={{
          paper: {
            sx: {
              width: { xs: 260, md: 320 }, // 🔥 più largo desktop
              backdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(0,0,0,0.85)',
              color: '#fff',
              borderLeft: '1px solid rgba(255,255,255,0.1)'
            }
          }
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/*USER */}
          {user && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 3
              }}
            >
              <AccountCircleIcon
                sx={{
                  fontSize: { xs: 24, md: 28 }
                }}
              />

              <Typography
                sx={{
                  fontSize: { xs: '1rem', md: '1.5rem' },
                  fontWeight: 500
                }}
              >
                {user.email?.split('@')[0]}
              </Typography>
            </Box>
          )}

          <List>
            {/* MENU */}
            <ListItem
              component={Link}
              to="/menu"
              onClick={() => setOpen(false)}
              sx={menuItemStyle}
            >
              <ListItemIcon sx={iconStyle}>
                <RestaurantMenuIcon />
              </ListItemIcon>
              <ListItemText
                primary="Menu"
                slotProps={{
                  primary: {
                    sx: textStyle
                  }
                }}
              />
            </ListItem>

            {/* ADMIN */}
            {role === 'admin' && (
              <ListItem
                component={Link}
                to="/admin"
                onClick={() => setOpen(false)}
                sx={menuItemStyle}
              >
                <ListItemIcon sx={iconStyle}>
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Admin"
                  slotProps={{
                    primary: {
                      sx: textStyle
                    }
                  }}
                />
              </ListItem>
            )}

            {/* LOGIN / LOGOUT */}
            {user ? (
              <ListItem onClick={handleLogout} sx={menuItemStyle}>
                <ListItemIcon sx={iconStyle}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  slotProps={{
                    primary: {
                      sx: textStyle
                    }
                  }}
                />
              </ListItem>
            ) : (
              <ListItem
                component={Link}
                to="/login"
                onClick={() => setOpen(false)}
                sx={menuItemStyle}
              >
                <ListItemIcon sx={iconStyle}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Login"
                  slotProps={{
                    primary: {
                      sx: textStyle
                    }
                  }}
                />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  )
}

/* 🔥 STILI RIUTILIZZABILI */

const menuItemStyle = {
  borderRadius: 2,
  mb: 1,
  color: 'white',

  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)'
  },

  px: { xs: 1.5, md: 2.5 },
  py: { xs: 1, md: 1.5 }
}

const iconStyle = {
  color: 'white',
  minWidth: 40,
  transform: { md: 'scale(1.2)' } // 🔥 icone più grandi desktop
}

const textStyle = {
  fontSize: { xs: '0.95rem', md: '1.2rem' }, // 🔥 testo più grande desktop
  fontWeight: 500
}
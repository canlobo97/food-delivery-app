import { useEffect, useState } from 'react'
import { Box, Button, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [visible, setVisible] = useState(false)

  const isIOS = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  )

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-dismissed')
    if (dismissed) return

    // Chrome
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)

      setTimeout(() => {
        setVisible(true)
      }, 3000) // ⏱ appare dopo 3 sec
    }

    window.addEventListener('beforeinstallprompt', handler)

    // iOS fallback
    if (isIOS && !isStandalone) {
      setTimeout(() => {
        setVisible(true)
      }, 3000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    await deferredPrompt.userChoice

    setVisible(false)
  }

  const closeBanner = () => {
    localStorage.setItem('pwa-dismissed', 'true')
    setVisible(false)
  }

  if (!visible || isStandalone) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        right: 20,
        bgcolor: '#1c1c1e',
        color: '#fff',
        p: 2,
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        zIndex: 9999,
        animation: 'slideUp 0.4s ease'
      }}
    >
      {/* 🎨 testo */}
      <Box>
        {isIOS ? (
          <Typography fontSize={14}>
            📲 Installa l’app:
            <br />
            <b>Condividi → Aggiungi a Home</b>
          </Typography>
        ) : (
          <Typography fontSize={14}>
            🚀 Installa EnjoyEat
            <br />
            Accesso veloce e notifiche 🔔
          </Typography>
        )}
      </Box>

      {/* 🎯 azioni */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {!isIOS && (
          <Button
            variant="contained"
            onClick={installApp}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Installa
          </Button>
        )}

        <IconButton onClick={closeBanner} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 🎬 animazione */}
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(100px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  )
}
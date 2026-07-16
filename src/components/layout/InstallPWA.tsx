import { useEffect, useState } from 'react'
import { Box, Button, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IosShareIcon from '@mui/icons-material/IosShare'
import { colors, fontFamily } from '../../theme/colors'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [visible, setVisible] = useState(true)

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
        bottom: {
          xs: 'calc(76px + env(safe-area-inset-bottom))',
          md: 20,
        },
        left: 20,
        right: 20,
        bgcolor: colors.surface,
        color: colors.ink,
        p: 2,
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: colors.shadow,
        border: `1px solid ${colors.border}`,
        zIndex: 9999,
        animation: 'slideUp 0.4s ease',
        fontFamily,
      }}
    >
      {/* 🎨 testo */}
      <Box>
        {isIOS ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, fontFamily }}>
              📲 Installa l’app
            </Typography>

            <Typography sx={{ fontSize: 13, color: colors.muted, fontFamily }}>
              1. Tocca
              <Box component="span" sx={{ mx: 0.5, verticalAlign: 'middle' }}>
                <IosShareIcon fontSize="small" sx={{ color: colors.accent }} />
              </Box>
              in basso
            </Typography>

            <Typography sx={{ fontSize: 13, color: colors.muted, fontFamily }}>
              2. Premi <b>&quot;Aggiungi alla schermata Home&quot;</b>
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ fontSize: 14, fontFamily, color: colors.ink }}>
            🚀 Installa EnjoyEat
            <br />
            <Box component="span" sx={{ color: colors.muted, fontSize: 13 }}>
              Accesso veloce e notifiche 🔔
            </Box>
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
              fontWeight: 700,
              fontFamily,
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
              boxShadow: colors.shadowFab,
            }}
          >
            Installa
          </Button>
        )}

        <IconButton onClick={closeBanner} sx={{ color: colors.muted }}>
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

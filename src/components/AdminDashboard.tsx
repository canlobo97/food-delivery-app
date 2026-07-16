import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material'
import {
  TrendingUp,
  LocalShipping,
} from '@mui/icons-material'
import { formatPrice } from '../utils/format'
import { colors, fontFamily } from '../theme/colors'

export default function AdminDashboard({ orders }: { orders: any[] }) {
  const delivered = orders.filter(o => o.status === 'consegnato')
  // const inDelivery = orders.filter(o => o.status === 'in_consegna')
  // const preparing = orders.filter(o => o.status === 'in_preparazione')

  const totalRevenue = delivered.reduce((sum, o) => sum + o.total, 0)

  const stats = [
    {
      title: 'Entrate',
      value: `${formatPrice(totalRevenue)}`,
      icon: <TrendingUp sx={{ color: colors.accent }} />,
    },
    {
      title: 'Ordini Totali',
      value: orders.length,
      icon: <LocalShipping sx={{ color: colors.accent }} />,
    },
  ]

  return (
    <Box sx={{ mt: 4, fontFamily }}>
      <Grid container spacing={2}>
        {stats.map((stat, i) => (
          <Grid
            key={i}
            size={{ xs: 6, sm: 6, md: 3 }} // ✅ FIX QUI
          >
            <Card
              sx={{
                borderRadius: { xs: 3, md: 4 },
                backgroundColor: colors.surface,
                color: colors.ink,
                boxShadow: colors.shadow,
                border: `1px solid ${colors.border}`,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: { md: 'translateY(-5px)' }
                }
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  {/* TESTO */}
                  <Box>
                    <Typography
                      sx={{
                        color: colors.muted,
                        fontSize: { xs: 12, md: 14 },
                        fontFamily,
                      }}
                    >
                      {stat.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 800,
                        mt: 1,
                        fontSize: {
                          xs: '20px',
                          md: '24px'
                        },
                        fontFamily,
                        color: colors.ink,
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>

                  {/* ICON */}
                  <Box
                    sx={{
                      width: { xs: 45, md: 50 },
                      height: { xs: 45, md: 50 },
                      ml: 2,
                      borderRadius: { xs: '10px', md: '12px' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: colors.accentSoft,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

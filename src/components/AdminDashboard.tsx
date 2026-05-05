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

export default function AdminDashboard({ orders }: { orders: any[] }) {
  const delivered = orders.filter(o => o.status === 'consegnato')
  const inDelivery = orders.filter(o => o.status === 'in_consegna')
  const preparing = orders.filter(o => o.status === 'in_preparazione')

  const totalRevenue = delivered.reduce((sum, o) => sum + o.total, 0)

  const stats = [
    {
      title: 'Entrate',
      value: `${formatPrice(totalRevenue)}`,
      icon: <TrendingUp />,
    },
    {
      title: 'Ordini Totali',
      value: orders.length,
      icon: <LocalShipping />,
    },
  ]

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        {stats.map((stat, i) => (
          <Grid
            key={i}
            size={{ xs: 6, sm: 6, md: 3 }} // ✅ FIX QUI
          >
            <Card
              sx={{
                borderRadius: { xs: 3, md: 4 },
                background: 'linear-gradient(145deg, #1c1c1e, #2c2c2e)',
                color: '#fff',
                boxShadow: {
                  xs: '0 6px 20px rgba(0,0,0,0.3)',
                  md: '0 10px 30px rgba(0,0,0,0.4)'
                },
                border: '1px solid rgba(255,255,255,0.08)',
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
                        opacity: 0.6,
                        fontSize: { xs: 12, md: 14 }
                      }}
                    >
                      {stat.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        mt: 1,
                        fontSize: {
                          xs: '20px',
                          md: '24px'
                        }
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
                      background: 'linear-gradient(45deg,#ff416c,#ff4b2b)',
                      boxShadow: '0 6px 20px rgba(255,75,43,0.5)'
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
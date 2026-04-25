import { Container, Typography, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 5,
          textAlign: 'center',
          px: 2
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '2rem', md: '3rem' }
          }}
          gutterBottom
        >
          EnjoyEat 🍕
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1rem', md: '1.3rem' }
          }}
          gutterBottom
        >
          Ordina il tuo cibo preferito direttamente da casa
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 3,
            width: { xs: '100%', sm: 'auto' }
          }}
          key={"/menu"}
          component={Link}
          to={"/menu"}
        >
            {"VAI AL MENU"}
        </Button>
      </Box>
    </Container>
  )
}
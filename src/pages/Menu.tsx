import { Container, Typography, Box } from '@mui/material'
import ProductCard from '../components/product/ProductCard'
import noodles from '../assets/productIMG/noodles-6.jpg'

const products = [
  { id: 1, name: 'Pizza Margherita', price: 8 , img: noodles},
  { id: 2, name: 'Burger', price: 10 , img: noodles},
  { id: 3, name: 'Pasta Carbonara', price: 12 , img: noodles},
  { id: 4, name: 'Insalata', price: 6 , img: noodles}
]

export default function Menu() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Menu 🍕
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3
        }}
      >
        {products.map((product) => (
          <Box
            key={product.id}
            sx={{
              width: {
                xs: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.33% - 16px)'
              }
            }}
          >
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>
    </Container>
  )
}
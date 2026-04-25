import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  CardMedia
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/cartSlice'
import type { AppDispatch } from '../../store/store'


type Product = {
  id: number
  name: string
  price: number
  img: string
}

export default function ProductCard({ product }: { product: Product }) {
    const dispatch = useDispatch<AppDispatch>()
  return (
    <Card>
      <CardMedia
        sx={{ height: 140 }}
        image={product.img}
        title="noodles"
      />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body1">{product.price}€</Typography>
      </CardContent>

      <CardActions>
        <Button
            variant="contained"
            fullWidth
            onClick={() => dispatch(addToCart(product))}
            >
            Aggiungi al carrello
        </Button>
      </CardActions>
    </Card>
  )
}



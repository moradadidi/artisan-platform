import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardMedia, CardContent, Box, Button, Rating } from '@mui/material';
import { Heart } from 'lucide-react';
import axios from 'axios';

// Sample data until API is connected
const sampleProducts = [
  {
    id: 1,
    name: "Handcrafted Vase",
    price: 59.99,
    rating: 4.5,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=400",
    artisan: "Sarah Miller"
  },
  {
    id: 2,
    name: "Ceramic Bowl Set",
    price: 45.99,
    rating: 4.8,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400",
    artisan: "John Doe"
  },
  {
    id: 3,
    name: "Woven Basket",
    price: 29.99,
    rating: 4.2,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1606293926075-91acedf0f1dc?auto=format&fit=crop&w=400",
    artisan: "Emma Wilson"
  }
];

const ProductSection = ({ title, products }) => {
  const productList = Array.isArray(products) ? products : [];
  
  return (
    <Box my={4}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="text.primary">
          {title}
        </Typography>
        <Button variant="outlined" color="primary" sx={{ textTransform: 'none' }}>
          View All
        </Button>
      </Box>
      <Grid container spacing={3}>
        {productList.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <Button
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  minWidth: 'auto',
                  p: 1,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  borderRadius: '50%',
                  '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                }}
              >
                <Heart size={20} />
              </Button>
              <CardMedia
                component="img"
                height="260"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  By {product.artisan}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={product.rating} precision={0.5} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.reviews})
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" fontWeight="600">
                  ${product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([...sampleProducts]);
  const [popularProducts, setPopularProducts] = useState([...sampleProducts]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await axios.get('/api/products/latest');
        setLatestProducts(Array.isArray(response.data) ? response.data : sampleProducts);
      } catch (error) {
        console.error('Error fetching latest products:', error);
        setLatestProducts([...sampleProducts]);
      }
    };

    const fetchPopularProducts = async () => {
      try {
        const response = await axios.get('/api/products/popular');
        setPopularProducts(Array.isArray(response.data) ? response.data : sampleProducts);
      } catch (error) {
        console.error('Error fetching popular products:', error);
        setPopularProducts([...sampleProducts]);
      }
    };

    fetchLatestProducts();
    fetchPopularProducts();
  }, []);

  return (
    <Container maxWidth="lg">
      <ProductSection title="Latest Arrivals" products={latestProducts} />
      <ProductSection title="Most Popular" products={popularProducts} />
    </Container>
  );
};

export default Home;
import { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import { Heart, ShoppingCart } from 'lucide-react';

const initialFavorites = [
  {
    id: 1,
    name: 'Handcrafted Vase',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=400',
    artisan: 'Sarah Miller',
    description: 'Beautiful handcrafted ceramic vase, perfect for any home decor.',
  },
  {
    id: 2,
    name: 'Ceramic Bowl Set',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400',
    artisan: 'John Doe',
    description: 'Set of 4 handmade ceramic bowls, each uniquely crafted.',
  },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState(initialFavorites);

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const addToCart = (item) => {
    // TODO: Implement cart functionality
    console.log('Added to cart:', item);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom>
          My Favorites
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {favorites.length} items saved
        </Typography>
      </Box>

      {favorites.length > 0 ? (
        <Grid container spacing={4}>
          {favorites.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="260"
                  image={item.image}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    By {item.artisan}
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${item.price}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCart size={20} />}
                      fullWidth
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => removeFromFavorites(item.id)}
                    >
                      <Heart size={20} fill="currentColor" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'background.paper',
            borderRadius: 2
          }}
        >
          <Typography variant="h5" gutterBottom>
            No favorites yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start exploring our collection and save items you love
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/discover"
          >
            Explore Products
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Favorites;

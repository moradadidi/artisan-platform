import { Container, Grid, Typography, Card, CardMedia, CardContent, Box, Button } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import {useEffect} from 'react';

const categories = [
  {
    id: 1,
    title: 'Ceramics',
    image: 'https://images.unsplash.com/photo-1565193298357-c5b46b0ff8fb?auto=format&fit=crop&w=400',
    description: 'Discover unique handcrafted pottery and ceramic art',
  },
  {
    id: 2,
    title: 'Textiles',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400',
    description: 'Explore handwoven fabrics and textile crafts',
  },
  {
    id: 3,
    title: 'Woodwork',
    image: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?auto=format&fit=crop&w=400',
    description: 'Browse beautiful handmade wooden furniture and decor',
  },
  {
    id: 4,
    title: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400',
    description: 'Find unique handcrafted jewelry pieces',
  },
];

const Discover = () => {
  useEffect(() => {
    document.title = 'Discover - Rarely';
  }, []);
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Discover Artisanal Treasures
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Explore unique handcrafted pieces from talented artisans around the world
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={category.image}
                alt={category.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {category.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {category.description}
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ArrowRight size={20} />}
                  sx={{ p: 0 }}
                >
                  Explore {category.title}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Featured Collections
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Curated selections of our finest artisanal pieces
        </Typography>
        {/* Add featured collections grid here */}
      </Box>
    </Container>
  );
};

export default Discover;
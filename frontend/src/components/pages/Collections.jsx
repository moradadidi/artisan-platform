import { Container, Grid, Typography, Card, CardMedia, CardContent, Box, Button } from '@mui/material';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    id: 1,
    title: 'Minimalist Home',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=400',
    items: 24,
    description: 'Clean lines and simple forms for modern living spaces',
  },
  {
    id: 2,
    title: 'Rustic Charm',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400',
    items: 18,
    description: 'Warm and inviting pieces with a traditional touch',
  },
  {
    id: 3,
    title: 'Coastal Living',
    image: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=400',
    items: 16,
    description: 'Beach-inspired designs for a relaxed atmosphere',
  },
  {
    id: 4,
    title: 'Urban Jungle',
    image: 'https://images.unsplash.com/photo-1545165375-1b744b9ed444?auto=format&fit=crop&w=400',
    items: 20,
    description: 'Nature-inspired pieces for city dwellers',
  },
];

const Collections = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Curated Collections
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Explore our thoughtfully curated collections of artisanal pieces
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {collections.map((collection) => (
          <Grid item xs={12} sm={6} key={collection.id}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={collection.image}
                alt={collection.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {collection.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {collection.items} Items
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {collection.description}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<ArrowRight size={20} />}
                >
                  View Collection
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Collections;
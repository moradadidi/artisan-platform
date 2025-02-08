import { Container, Grid, Typography, Card, CardMedia, CardContent, Box, Button, Avatar } from '@mui/material';
import { MapPin, Star } from 'lucide-react';

const artisans = [
  {
    id: 1,
    name: 'Sarah Miller',
    location: 'Portland, OR',
    specialty: 'Ceramics',
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=400',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100',
    description: 'Specializing in minimalist ceramic designs with a focus on functionality and beauty.',
  },
  {
    id: 2,
    name: 'John Doe',
    location: 'Austin, TX',
    specialty: 'Woodworking',
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?auto=format&fit=crop&w=400',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100',
    description: 'Creating bespoke wooden furniture with sustainable materials and traditional techniques.',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    location: 'Brooklyn, NY',
    specialty: 'Textile Art',
    rating: 4.7,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100',
    description: 'Weaving contemporary textiles inspired by traditional patterns and natural dyes.',
  },
];

const Artisans = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Meet Our Artisans
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Discover the talented creators behind our unique handcrafted pieces
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {artisans.map((artisan) => (
          <Grid item xs={12} md={4} key={artisan.id}>
            <Card>
              <CardMedia
                component="img"
                height="240"
                image={artisan.image}
                alt={artisan.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={artisan.avatar}
                    alt={artisan.name}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      {artisan.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <MapPin size={16} />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {artisan.location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {artisan.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Star size={16} fill="#FFD700" stroke="#FFD700" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {artisan.rating} ({artisan.reviews} reviews)
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  Specializes in {artisan.specialty}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Artisans;
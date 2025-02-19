import { useState ,useEffect} from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  Box, 
  Button, 
  Avatar,
  Rating,
  InputBase,
  IconButton,
  Paper,
  Chip,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { MapPin, Star, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    tags: ['Ceramics', 'Minimalist', 'Home Decor'],
    featured: true,
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
    tags: ['Woodworking', 'Furniture', 'Sustainable'],
    featured: true,
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
    tags: ['Textiles', 'Contemporary', 'Sustainable'],
    featured: false,
  },
];

const specialties = ['All', 'Ceramics', 'Woodworking', 'Textile Art', 'Jewelry', 'Glass Art'];

const Artisans = () => {
  useEffect(() => {
    document.title = 'Artisans - Rarely';
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const navigate = useNavigate();

  const filteredArtisans = artisans.filter(artisan => {
    const matchesSearch = artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artisan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artisan.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'All' || artisan.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <Container maxWidth="lg">
      {/* Header and Search */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" gutterBottom>
          Meet Our Artisans
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Discover talented creators and their unique crafts
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderRadius: 2
              }}
            >
              <IconButton sx={{ p: '10px' }}>
                <Search />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search artisans by name, specialty, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <Select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                displayEmpty
                sx={{ borderRadius: 2 }}
              >
                {specialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {filteredArtisans.map((artisan) => (
          <Grid item xs={12} md={4} key={artisan.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="240"
                image={artisan.image}
                alt={artisan.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
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

                <Box sx={{ mb: 2 }}>
                  {artisan.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>

                <Typography variant="body1" color="text.secondary" paragraph>
                  {artisan.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star size={16} fill="#FFD700" stroke="#FFD700" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {artisan.rating} ({artisan.reviews} reviews)
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  endIcon={<ArrowRight size={20} />}
                  onClick={() => navigate(`/artisans/${artisan.id}`)}
                  sx={{ mt: 'auto' }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredArtisans.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            No artisans found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Artisans;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Avatar,
  Button,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Divider,
} from '@mui/material';
import {
  MapPin,
  Star,
  Heart,
  ShoppingCart,
  Instagram,
  Twitter,
  Globe,
} from 'lucide-react';
import axios from 'axios';

const ArtisanProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artisanData, setArtisanData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fallback values if API does not provide certain fields.
  const fallbackCoverImage = "https://via.placeholder.com/1200x400?text=Cover+Image";
  const fallbackSpecialty = "Artisanal Crafts";

  // Handler for tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFollowToggle = () => {
    setFollowing(!following);
  };

  // Fetch artisan data using Axios
  useEffect(() => {
    const fetchArtisanData = async () => {
      try {
        const response = await axios.get(`https://rarely.onrender.com/api/users/${id}`);
        setArtisanData(response.data);
        console.log('Artisan data:', response.data);
      } catch (error) {
        console.error('Error fetching artisan data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtisanData();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" className="mt-8">
        <Typography variant="h5" align="center">
          Loading artisan profile...
        </Typography>
      </Container>
    );
  }

  if (!artisanData) {
    return (
      <Container maxWidth="lg" className="mt-8">
        <Typography variant="h5" align="center">
          Artisan not found.
        </Typography>
      </Container>
    );
  }

  // Define fallback values for fields not provided by API
  const coverImage = artisanData.coverImage || fallbackCoverImage;
  const specialty = artisanData.specialty || fallbackSpecialty;
  const products = artisanData.products || [];

  // ProductCard component (used in Products tab)
  const ProductCard = ({ product }) => (
    <Card sx={{ height: '100%' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {product.name}
        </Typography>
        <Box sx={{ mb: 1 }}>
          {product.tags && product.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviews})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>
          <Box>
            <IconButton size="small" sx={{ mr: 1 }}>
              <Heart size={20} />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <ShoppingCart size={20} />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Cover Image */}
      <Box
        sx={{
          height: { xs: 200, md: 300 },
          position: 'relative',
          backgroundImage: `url("https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1200")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }
        }}
      />

      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, gap: 3 }}>
                <Avatar
                  src={artisanData.profilePicture || 'https://via.placeholder.com/150'}
                  sx={{ 
                    width: { xs: 120, md: 160 }, 
                    height: { xs: 120, md: 160 },
                    border: '4px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h4">
                      {artisanData.name}
                    </Typography>
                    <Chip 
                      label={specialty}
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                    <MapPin size={18} />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {artisanData.address}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 3 }}>
                      <Star size={18} fill="#FFD700" stroke="#FFD700" />
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {artisanData.rating} ({artisanData.reviews} reviews)
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {artisanData.bio}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant={following ? "outlined" : "contained"}
                      onClick={handleFollowToggle}
                    >
                      {following ? 'Following' : 'Follow'}
                    </Button>
                    <IconButton component="a" href={artisanData.socialLinks?.instagram} target="_blank">
                      <Instagram />
                    </IconButton>
                    <IconButton component="a" href={artisanData.socialLinks?.twitter} target="_blank">
                      <Twitter />
                    </IconButton>
                    <IconButton component="a" href={artisanData.socialLinks?.website} target="_blank">
                      <Globe />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {artisanData.stats?.totalSales || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sales
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {artisanData.stats?.completedOrders || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Orders
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {artisanData.stats?.averageRating || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Rating
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {artisanData.stats?.responseTime || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Response Time
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Products" />
                <Tab label="Reviews" />
                <Tab label="About" />
              </Tabs>
            </Box>

            {activeTab === 0 && (
              <Grid container spacing={3}>
                {products.length > 0 ? (
                  products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))
                ) : (
                  <Typography>No products available.</Typography>
                )}
              </Grid>
            )}

            {activeTab === 1 && (
              <Typography>Reviews content</Typography>
            )}

            {activeTab === 2 && (
              <Typography>About content</Typography>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ArtisanProfile;

import { useState } from 'react';
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
import { MapPin, Star, Heart, ShoppingCart, Instagram, Twitter, Globe } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const artisanData = {
  id: 1,
  name: "Sarah Miller",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150",
  coverImage: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1200",
  location: "Portland, OR",
  specialty: "Ceramics",
  rating: 4.8,
  reviews: 156,
  bio: "Specializing in minimalist ceramic designs with a focus on functionality and beauty. Each piece is handcrafted with care and attention to detail.",
  experience: "15 years",
  socialLinks: {
    instagram: "https://instagram.com/sarahmiller",
    twitter: "https://twitter.com/sarahmiller",
    website: "https://sarahmiller.com"
  },
  products: [
    {
      id: 1,
      name: "Handcrafted Vase",
      price: 59.99,
      rating: 4.5,
      reviews: 12,
      image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=400",
      tags: ["Handmade", "Ceramic", "Vase"],
      isFavorite: false
    },
    {
      id: 2,
      name: "Ceramic Bowl Set",
      price: 45.99,
      rating: 4.8,
      reviews: 28,
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400",
      tags: ["Handmade", "Ceramic", "Kitchen"],
      isFavorite: true
    }
  ],
  stats: {
    totalSales: 1250,
    completedOrders: 450,
    averageRating: 4.8,
    responseTime: "2 hours"
  }
};

const ArtisanProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [following, setFollowing] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFollowToggle = () => {
    setFollowing(!following);
  };

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
          {product.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
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
                }
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
          backgroundImage: `url(${artisanData.coverImage})`,
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
                  src={artisanData.avatar}
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
                      label={artisanData.specialty}
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                    <MapPin size={18} />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {artisanData.location}
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
                    <IconButton href={artisanData.socialLinks.instagram} target="_blank">
                      <Instagram />
                    </IconButton>
                    <IconButton href={artisanData.socialLinks.twitter} target="_blank">
                      <Twitter />
                    </IconButton>
                    <IconButton href={artisanData.socialLinks.website} target="_blank">
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
                      {artisanData.stats.totalSales}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sales
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {artisanData.stats.completedOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Orders
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {artisanData.stats.averageRating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Rating
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {artisanData.stats.responseTime}
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
                {artisanData.products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
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
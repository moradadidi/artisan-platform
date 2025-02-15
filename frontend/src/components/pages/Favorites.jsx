import { useState, useEffect } from 'react';
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
  Rating,
  Chip,
  Tabs,
  Tab,
  Divider,
  Avatar,
} from '@mui/material';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const Favorites = () => {
  const [favoriteDocs, setFavoriteDocs] = useState([]); // an array of favorite documents
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  // Get user & token from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Fetch user's favorites from the server
  const fetchFavorites = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/favorites/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // The response is presumably an array of favorites
      // e.g. [ { _id, user, product: {...} }, { ... }, ... ]
      const data = response.data;

      // Ensure it's an array
      const favoritesArray = Array.isArray(data) ? data : [data];
      setFavoriteDocs(favoritesArray);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites.');
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchFavorites();
    }
  }, []);

  // Remove a single favorite (call DELETE /api/favorite/:id)
  const removeFromFavorites = async (favoriteId) => {
    try {
      // Call the DELETE endpoint with the favorite's _id.
      const response = await axios.delete(`http://127.0.0.1:5000/api/favorites/${favoriteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data) {
        toast.success('Removed from favorites');
        // Remove the favorite from local state by filtering out the deleted favorite.
        setFavoriteDocs((prev) => prev.filter((fav) => fav._id !== favoriteId));
      } else {
        toast.error('Favorite not found.');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Could not remove favorite. Please try again.');
    }
  };
  

  // Add to cart (placeholder logic)
  const addToCart = (product) => {
    toast.success(`Added "${product.name}" to cart!`);
  };

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  // A card to display each favorited product
  const ProductCard = ({ favorite }) => {
    const { _id: favoriteId, product } = favorite;

    if (!product) {
      // Safety check if there's no product data
      return null;
    }

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="260"
            image={product.images?.[0] || '/default.png'}
            alt={product.name}
            sx={{ objectFit: 'cover', cursor: 'pointer' }}
            onClick={() => navigate(`/products/${product._id}`)}
          />
          {/* Remove from favorites icon */}
          <IconButton
            onClick={() => removeFromFavorites(favoriteId)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': { backgroundColor: 'white', transform: 'scale(1.1)' },
            }}
          >
            <Heart size={20} fill="#ff4081" color="#ff4081" />
          </IconButton>
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {/* Artisan / user info */}
          {product.user && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => navigate(`/artisans/${product.user._id}`)}
            >
              <Avatar
                src={product.user.profilePicture || '/default.png'}
                alt={product.user.name || 'Artisan'}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Typography variant="subtitle2">
                {product.user.name || 'Unknown Artisan'}
              </Typography>
            </Box>
          )}

          {/* Product name */}
          <Typography
            variant="h6"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate(`/products/${product._id}`)}
          >
            {product.name}
          </Typography>

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
            {product.tags?.map((tag) => (
              <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
            ))}
          </Box>

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating
              value={product.rating || 0}
              precision={0.5}
              size="small"
              readOnly
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviews || 0})
            </Typography>
          </Box>

          {/* Price & Add to Cart */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 'auto',
            }}
          >
            <Typography variant="h6" color="primary">
              ${product.price || 0}
            </Typography>
            <IconButton
              color="primary"
              onClick={() => addToCart(product)}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
            >
              <ShoppingCart size={20} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          My Favorites
        </Typography>

        {/* If you want multiple tabs (e.g. Products vs. Artisans), keep this. 
            Otherwise, remove or adapt as needed. */}
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label={`Products (${favoriteDocs.length})`} />
        </Tabs>
      </Box>

      
      {activeTab === 0 && (
        <>
          {favoriteDocs.length > 0 ? (
            <Grid container spacing={3}>
              {favoriteDocs.map((fav) => (
                <Grid item xs={12} sm={6} md={4} key={fav._id}>
                  <ProductCard favorite={fav} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                backgroundColor: 'background.paper',
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" gutterBottom>
                No favorite products yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Start exploring our collection and save items you love.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/products"
              >
                Explore Products
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Favorites;

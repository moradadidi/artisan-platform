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
  Chip,
  Avatar,
  Rating,
  Fade,
  useTheme,
  Drawer,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Breadcrumbs,
  Paper,
  InputBase,
  Tooltip,
  Skeleton,
} from '@mui/material';
import {
  Heart,
  ShoppingCart,
  ArrowRight,
  MapPin,
  Filter,
  Search,
  Star,
} from 'lucide-react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { tokens } from '../../theme';

/** Hero Banner Component */
const HeroBanner = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 300, md: 500 },
        mb: 6,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CardMedia
        component="img"
        image="./valeria.jpg"
        alt="Hero Banner"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.7)',
          transition: 'transform 0.5s ease',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          p: 2,
        }}
      >
        <Fade in={loaded} timeout={1000}>
          <Box>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 700, mb: 2, color: 'white' }}
            >
              Discover Unique Artisanal Creations
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'white', mb: 4 }}>
              Handcrafted pieces made with passion and precision.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={() => navigate('/shop')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                }}
              >
                Shop Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': { borderColor: 'white' },
                }}
                onClick={() => navigate('/collections')}
              >
                Explore Collections
              </Button>
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

/** Product Card Component */
const ProductCard = ({ product, isFavorite, onFavoriteToggle, onAddToCart }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const mainImage =
    product.images && product.images.length > 0 ? product.images[0] : '/default.png';
  const userData = product.user || {};
  const userName = userData.name || 'Unknown Artisan';
  const userAddress = userData.adresse || 'No address provided';
  const userProfilePic = userData.profilePicture || '/default.png';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="260"
          image={mainImage}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'scale(1.05)' },
          }}
          onClick={() => navigate(`/products/${product._id}`)}
        />
        <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(product._id);
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': { backgroundColor: 'white', transform: 'scale(1.1)' },
            }}
          >
            <Heart
              size={20}
              fill={isFavorite ? '#ff4081' : 'none'}
              color={isFavorite ? '#ff4081' : '#666'}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            cursor: 'pointer',
            '&:hover .artisan-name': { color: 'primary.main' },
          }}
          onClick={() => {
            if (userData._id) navigate(`/artisans/${userData._id}`);
          }}
        >
          <Avatar
            src={userProfilePic}
            alt={userName}
            sx={{ width: 40, height: 40, mr: 1 }}
          />
          <Box>
            <Typography
              variant="subtitle2"
              className="artisan-name"
              sx={{ transition: 'color 0.2s ease-in-out' }}
            >
              {userName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <MapPin size={14} color="#666" />
              <Typography variant="caption" color="text.secondary">
                {userAddress}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ ml: 'auto', textAlign: 'right' }}>
            <Rating value={product.rating || 3} size="small" readOnly />
            <Typography variant="caption" color="text.secondary" display="block">
              {product.reviews || 0} reviews
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
          onClick={() => navigate(`/products/${product._id}`)}
        >
          {product.name}
        </Typography>
        {product.tags && product.tags.length > 0 && (
          <Box sx={{ mb: 1 }}>
            {product.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
            ))}
          </Box>
        )}
        <Typography variant="body2" color="text.secondary" paragraph noWrap>
          {product.description}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product._id);
            }}
            sx={{
              backgroundColor: `${colors.yellowAccent[400]}`,
              color: 'white',
              '&:hover': { backgroundColor: `${colors.yellowAccent[500]}` },
            }}
          >
            <ShoppingCart size={20} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

/** Product Section Component */
const ProductSection = ({ title, products, favorites, onFavoriteToggle, onViewAll, onAddToCart }) => {
  const navigate = useNavigate();

  return (
    <Box my={4}>
      <Box className="flex flex-wrap justify-between items-center mb-3 gap-2">
        <Typography variant="h4" className="text-gray-800 font-bold">
          {title}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          endIcon={<ArrowRight />}
          onClick={onViewAll}
          className="rounded-md text-base px-4"
        >
          View All
        </Button>
      </Box>
      <Grid container spacing={3}>
        {products.map((product) => {
          const isFavorite = !!favorites[product._id]?.isFavorite;
          return (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <ProductCard
                product={product}
                isFavorite={isFavorite}
                onFavoriteToggle={onFavoriteToggle}
                onAddToCart={onAddToCart}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

/** Main Home Component */
const Home = () => {
  useEffect(() => {
    document.title = 'Home - Rarely';
  }, []);

  const navigate = useNavigate();
  // Initialize user in state so it doesn't change on every render.
  const [user] = useState(() => JSON.parse(sessionStorage.getItem('user')));
  const token = sessionStorage.getItem('token');

  const [latestProducts, setLatestProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch favorites for the logged-in user.
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/favorites/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favoritesMap = {};
        response.data.forEach((fav) => {
          favoritesMap[fav.product._id] = {
            favoriteId: fav._id,
            isFavorite: true,
          };
        });
        setFavorites(favoritesMap);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user, token]);

  // Handle favorite toggle.
  const handleFavoriteToggle = async (productId) => {
    if (!user) {
      toast.error('You must be logged in to favorite products.');
      return;
    }
    const isCurrentlyFav = !!favorites[productId]?.isFavorite;
    if (isCurrentlyFav) {
      try {
        const favoriteId = favorites[productId].favoriteId;
        await axios.delete(`http://127.0.0.1:5000/api/favorites/${favoriteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Removed from favorites');
        setFavorites((prev) => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });
      } catch (error) {
        console.error('Error removing favorite:', error);
        toast.error('Error removing favorite. Please try again.');
      }
    } else {
      try {
        const response = await axios.post(
          `http://127.0.0.1:5000/api/favorites`,
          { product: productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Added to favorites');
        setFavorites((prev) => ({
          ...prev,
          [productId]: { favoriteId: response.data._id, isFavorite: true },
        }));
      } catch (error) {
        console.error('Error adding favorite:', error);
        toast.error('Error adding to favorites. Please try again.');
      }
    }
  };

  // Fetch products for both sections.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/products');
        setLatestProducts(response.data);
        setPopularProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLatestProducts([]);
        setPopularProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add to cart handler.
  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error('You must be logged in to add products to your cart.');
      return;
    }
    const product = latestProducts.find((p) => p._id === productId);
    if (!product) return;
    const payload = {
      customerId: user._id,
      products: [{ productId, quantity: 1 }],
      totalAmount: product.price,
    };

    try {
      await axios.post('http://127.0.0.1:5000/api/cart', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="mt-4 mb-4">
        {/* Skeleton for HeroBanner */}
        <Skeleton variant="rectangular" height={300} className="mb-6 rounded" />
        {/* Skeleton for section header */}
        <Skeleton variant="text" width="30%" height={40} className="mb-4" />
        <Grid container spacing={3}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={350} className="rounded" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="mt-4 mb-4">
      <HeroBanner />
      <ProductSection
        title="Latest Arrivals"
        products={latestProducts}
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
        onAddToCart={handleAddToCart}
        onViewAll={() => navigate('/shop')}
      />
      <ProductSection
        title="Most Popular"
        products={popularProducts}
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
        onAddToCart={handleAddToCart}
        onViewAll={() => navigate('/shop')}
      />
    </Container>
  );
};

export default Home;

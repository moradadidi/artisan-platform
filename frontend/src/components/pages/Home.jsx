import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardMedia, CardContent, Box, Button, Rating, IconButton, Chip } from '@mui/material';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    artisan: "Sarah Miller",
    description: "Beautiful handcrafted ceramic vase, perfect for any home decor.",
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
    artisan: "John Doe",
    description: "Set of 4 handmade ceramic bowls, each uniquely crafted.",
    tags: ["Handmade", "Ceramic", "Kitchen"],
    isFavorite: true
  },
  {
    id: 3,
    name: "Woven Basket",
    price: 29.99,
    rating: 4.2,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1606293926075-91acedf0f1dc?auto=format&fit=crop&w=400",
    artisan: "Emma Wilson",
    description: "Handwoven basket made from sustainable materials.",
    tags: ["Handmade", "Basket", "Storage"],
    isFavorite: false
  }
];

const ProductCard = ({ product, onFavoriteToggle, onAddToCart }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

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
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }}
      onClick={handleProductClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="260"
          image={product.image}
          alt={product.name}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(product.id);
          }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: 'white',
              transform: 'scale(1.1)'
            }
          }}
        >
          <Heart 
            size={20} 
            fill={product.isFavorite ? '#ff4081' : 'none'}
            color={product.isFavorite ? '#ff4081' : '#666'}
          />
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
        <Typography variant="h6" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          By {product.artisan}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviews})
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 'auto'
        }}>
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>
          <IconButton 
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product.id);
            }}
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
      </CardContent>
    </Card>
  );
};

const ProductSection = ({ title, products, onViewAll }) => {
  const [favorites, setFavorites] = useState({});

  const handleFavoriteToggle = (productId) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleAddToCart = (productId) => {
    // Implement cart functionality
    console.log('Added to cart:', productId);
  };

  return (
    <Box my={4}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" color="text.primary">
          {title}
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          endIcon={<ArrowRight />}
          onClick={onViewAll}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          View All
        </Button>
      </Box>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard 
              product={{
                ...product,
                isFavorite: favorites[product.id]
              }}
              onFavoriteToggle={handleFavoriteToggle}
              onAddToCart={handleAddToCart}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const Home = () => {
  const navigate = useNavigate();
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
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <ProductSection 
        title="Latest Arrivals" 
        products={latestProducts}
        onViewAll={() => navigate('/products?sort=latest')}
      />
      <ProductSection 
        title="Most Popular" 
        products={popularProducts}
        onViewAll={() => navigate('/products?sort=popular')}
      />
    </Container>
  );
};

export default Home;
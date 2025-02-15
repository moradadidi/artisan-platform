import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  IconButton,
  Rating,
  Drawer,
  Checkbox,
  Slider,
  FormGroup,
  FormControlLabel,
  Divider,
  Button,
  Breadcrumbs,
  Link,
  Chip,
  Paper,
  InputBase,
  Avatar,
  Tooltip,
} from '@mui/material';
import { Heart, ShoppingCart, Filter, Search, Star, ArrowUpRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const categories = [
  "All Categories",
  "Ceramics",
  "Textiles",
  "Woodwork",
  "Jewelry",
  "Home Decor",
  "Kitchen",
  "Art"
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState(['All Categories']);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Toggle favorite by calling backend endpoints
  const handleFavoriteToggle = async (productId) => {
    if (!user) {
      toast.error('You must be logged in to favorite products.');
      return;
    }
    const product = products.find(p => p.id === productId);
    try {
      if (!product.isFavorite) {
        // Add favorite
        const response = await axios.post(
          'http://127.0.0.1:5000/api/favorite',
          { product: productId },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        toast.success('Added to favorites');
        // Update product locally with favorite info
        setProducts(prev =>
          prev.map(p =>
            p.id === productId 
              ? { ...p, isFavorite: true, favoriteId: response.data._id } 
              : p
          )
        );
      } else {
        // Remove favorite using favoriteId
        await axios.delete(
          `http://127.0.0.1:5000/api/favorite/${product.favoriteId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        toast.success('Removed from favorites');
        setProducts(prev =>
          prev.map(p =>
            p.id === productId 
              ? { ...p, isFavorite: false, favoriteId: null } 
              : p
          )
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error updating favorites. Please try again.');
    }
  };

  // Update Add to Cart: call backend API and show notifications
  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error('You must be logged in to add products to your cart.');
      return;
    }
    const product = products.find(p => p.id === productId);
    const payload = {
      customerId: user._id,
      products: [{ productId, quantity: 1 }],
      totalAmount: product.price,
    };

    try {
      await axios.post('http://127.0.0.1:5000/api/cart', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart. Please try again.');
    }
  };

  // Handle filtering UI state
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryChange = (category) => {
    if (category === 'All Categories') {
      setSelectedCategories(['All Categories']);
    } else {
      const newCategories = selectedCategories.filter(c => c !== 'All Categories');
      if (newCategories.includes(category)) {
        setSelectedCategories(newCategories.filter(c => c !== category));
      } else {
        setSelectedCategories([...newCategories, category]);
      }
    }
  };

  // Fetch products from backend and format them for our UI.
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/products');
      const data = await response.json();
      const formattedProducts = data.map(product => ({
        id: product._id,
        name: product.name,
        price: product.price || 0,
        rating: product.rating || 0,
        reviews: product.numReviews || 0,
        image: product.images[0] || '',
        artisan: {
          id: product.user._id || 0,
          name: product.user.name || 'Unknown',
          avatar: product.user.profilePicture || '',
          location: product.user.adresse || 'Canada, Ontario',
          rating: product.artisanRating || 3,
          reviews: product.artisanReviews || 125
        },
        category: product.category || 'Uncategorized',
        tags: product.tags || [],
        inStock: product.countInStock > 0,
        isFavorite: product.isFavorite || false,
        favoriteId: product.favoriteId || null
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();  
  }, []);

  // Filter content for the Drawer / Sidebar
  const FilterContent = () => (
    <Box sx={{ p: 3 }}>
      {/* Search */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        p: 1,
        mb: 3
      }}>
        <Search size={20} color="#666" />
        <InputBase
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
        />
      </Box>

      {/* Categories */}
      <Typography variant="subtitle1" gutterBottom>Categories</Typography>
      <FormGroup>
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
            }
            label={category}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 3 }} />

      {/* Price Range */}
      <Typography variant="subtitle1" gutterBottom>Price Range</Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={200}
        sx={{ mt: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="body2">${priceRange[0]}</Typography>
        <Typography variant="body2">${priceRange[1]}</Typography>
      </Box>

      <Button variant="contained" fullWidth sx={{ mt: 3 }}>
        Apply Filters
      </Button>
    </Box>
  );

  // Single Product Card component
  const ProductCard = ({ product }) => (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }
    }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="260"
          image={product.image}
          alt={product.name}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'scale(1.05)' }
          }}
          onClick={() => navigate(`/products/${product.id}`)}
        />
        <Tooltip title={product.isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteToggle(product.id);
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': { backgroundColor: 'white', transform: 'scale(1.1)' }
            }}
          >
            <Heart 
              size={20} 
              fill={product.isFavorite ? '#ff4081' : 'none'}
              color={product.isFavorite ? '#ff4081' : '#666'}
            />
          </IconButton>
        </Tooltip>
        {!product.inStock && (
          <Chip
            label="Out of Stock"
            color="error"
            size="small"
            sx={{ position: 'absolute', left: 8, top: 8 }}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Artisan Info */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            cursor: 'pointer',
            '&:hover .artisan-name': { color: 'primary.main' }
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/artisans/${product.artisan.id}`);
          }}
        >
          <Avatar
            src={product.artisan.avatar}
            alt={product.artisan.name}
            sx={{ width: 40, height: 40, mr: 1 }}
          />
          <Box>
            <Typography variant="subtitle2" className="artisan-name" sx={{ transition: 'color 0.2s ease-in-out' }}>
              {product.artisan.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <MapPin size={14} color="#666" />
              <Typography variant="caption" color="text.secondary">
                {product.artisan.location}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ ml: 'auto', textAlign: 'right' }}>
            <Rating value={product.artisan.rating} size="small" readOnly />
            <Typography variant="caption" color="text.secondary" display="block">
              {product.artisan.reviews} reviews
            </Typography>
          </Box>
        </Box>

        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.name}
        </Typography>

        <Box sx={{ mb: 1 }}>
          {product.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviews})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2 }}>
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>
          <Tooltip title={product.inStock ? 'Add to Cart' : 'Out of Stock'}>
            <span>
              <IconButton 
                color="primary"
                disabled={!product.inStock}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product.id);
                }}
                sx={{
                  backgroundColor: product.inStock ? 'primary.main' : 'grey.200',
                  color: 'white',
                  '&:hover': { backgroundColor: product.inStock ? 'primary.dark' : 'grey.200' }
                }}
              >
                <ShoppingCart size={20} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { sm: 'none' } }}
      >
        <Box sx={{ width: 280 }}>
          <FilterContent />
        </Box>
      </Drawer>

      {/* Desktop Filters Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 280,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          borderRight: '1px solid #eee',
          height: 'calc(100vh - 64px)',
          position: 'sticky',
          top: 64,
          overflowY: 'auto'
        }}
      >
        <FilterContent />
      </Paper>

      {/* Main Products Grid */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Container maxWidth="xl">
          {/* Header & Breadcrumbs */}
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
              <Link underline="hover" color="inherit" href="/">
                Home
              </Link>
              <Typography color="text.primary">Shop</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" gutterBottom>
                All Products
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" startIcon={<Star />}>
                  Popular
                </Button>
                <Button variant="outlined" startIcon={<ArrowUpRight />}>
                  Latest
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Mobile Filter Button */}
          <Box sx={{ display: { sm: 'none' }, mb: 2 }}>
            <Button startIcon={<Filter />} variant="outlined" onClick={() => setDrawerOpen(true)} fullWidth>
              Filters
            </Button>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Products;

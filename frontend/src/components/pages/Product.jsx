import { useEffect, useState } from 'react';
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
  Tooltip,
} from '@mui/material';
import { Heart, ShoppingCart, Filter, Search, Star, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Sample product data (for initial render); replace with API data as needed.
const sampleProducts = [
  {
    id: 1,
    name: "Handcrafted Ceramic Vase",
    price: 59.99,
    rating: 4.5,
    numReviews: 12,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=400",
    artisan: "Sarah Miller",
    category: "Home Decor",
    tags: ["Handmade", "Ceramic", "Vase"],
    // For local sample data we use this property:
    inStock: true,
    isFavorite: false,
  },
  {
    id: 2,
    name: "Artisanal Bowl Set",
    price: 45.99,
    rating: 4.8,
    numReviews: 28,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400",
    artisan: "John Doe",
    category: "Kitchen",
    tags: ["Handmade", "Ceramic", "Set"],
    inStock: true,
    isFavorite: true,
  },
];

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

// FilterContent component to display filter options
const FilterContent = ({
  selectedCategories,
  handleCategoryChange,
  priceRange,
  handlePriceChange,
  searchQuery,
  setSearchQuery,
}) => (
  <Box>
    {/* Search Field */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        p: 1,
        mb: 3,
      }}
    >
      <Search size={20} color="#666" />
      <InputBase
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ ml: 1, flex: 1 }}
      />
    </Box>

    {/* Categories Selection */}
    <Typography variant="subtitle1" gutterBottom>
      Categories
    </Typography>
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

    {/* Price Range Slider */}
    <Typography variant="subtitle1" gutterBottom>
      Price Range
    </Typography>
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

// ProductCard component to display individual products
const ProductCard = ({ product, onFavoriteToggle, onAddToCart }) => {
  const navigate = useNavigate();

  // If the fetched product uses countInStock instead of inStock, check it.
  const isInStock =
    product.inStock !== undefined ? product.inStock : product.countInStock > 0;
  // Use numReviews if available; fallback to reviews property.
  const reviews = product.numReviews !== undefined ? product.numReviews : product.reviews;

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
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
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      }}
      onClick={() => handleProductClick(product._id)}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="260"
          image="../../../public/default.png"
          alt={product.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
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
              transform: 'scale(1.1)',
            },
          }}
        >
          <Heart
            size={20}
            fill={product.isFavorite ? '#ff4081' : 'none'}
            color={product.isFavorite ? '#ff4081' : '#666'}
          />
        </IconButton>
        {!isInStock && (
          <Chip
            label="Out of Stock"
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              left: 8,
              top: 8,
            }}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 1 }}>
          {product.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>
        <Typography variant="h6" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          By {product.artisan || 'Unknown Artisan'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({reviews})
          </Typography>
        </Box>
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
          <Tooltip title={isInStock ? 'Add to Cart' : 'Out of Stock'}>
            <span>
              <IconButton
                color="primary"
                disabled={!isInStock}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product.id);
                }}
                sx={{
                  backgroundColor: isInStock ? 'primary.main' : 'grey.200',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: isInStock ? 'primary.dark' : 'grey.200',
                  },
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
};

const Products = () => {
  const [products, setProducts] = useState(sampleProducts);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState(['All Categories']);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Uncomment and use useEffect to fetch products on component mount.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/products');
        console.table(response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleFavoriteToggle = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    );
  };

  const handleAddToCart = (productId) => {
    // Implement cart functionality here.
    console.log('Added to cart:', productId);
    // Optionally, refresh products if needed:
    // fetchProducts();
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryChange = (category) => {
    if (category === 'All Categories') {
      setSelectedCategories(['All Categories']);
    } else {
      const newCategories = selectedCategories.filter((c) => c !== 'All Categories');
      if (newCategories.includes(category)) {
        setSelectedCategories(newCategories.filter((c) => c !== category));
      } else {
        setSelectedCategories([...newCategories, category]);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { sm: 'none' } }}
      >
        <Box sx={{ width: 280, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <FilterContent
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            handlePriceChange={handlePriceChange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </Box>
      </Drawer>

      {/* Desktop Filters */}
      <Paper
        elevation={0}
        sx={{
          width: 280,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          p: 3,
          borderRight: '1px solid #eee',
          height: 'calc(100vh - 64px)',
          position: 'sticky',
          top: 64,
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <FilterContent
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          handlePriceChange={handlePriceChange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Paper>

      {/* Products Grid */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Container maxWidth="xl">
          {/* Header */}
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
            <Button
              startIcon={<Filter />}
              variant="outlined"
              onClick={() => setDrawerOpen(true)}
              fullWidth
            >
              Filters
            </Button>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard
                  product={product}
                  onFavoriteToggle={handleFavoriteToggle}
                  onAddToCart={handleAddToCart}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Products;

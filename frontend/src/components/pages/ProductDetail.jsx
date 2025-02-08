import { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  Rating,
  Chip,
  Divider,
  TextField,
  Paper,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { Heart, Minus, Plus, ShoppingCart, Share2, Truck } from 'lucide-react';
import { useParams } from 'react-router-dom';

// Mock product data - replace with actual API call
const product = {
  id: 1,
  name: "Handcrafted Ceramic Vase",
  price: 59.99,
  rating: 4.5,
  reviews: 12,
  description: "Beautiful handcrafted ceramic vase, perfect for any home decor. Each piece is uniquely made with attention to detail and quality craftsmanship.",
  images: [
    "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=400",
    "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=400",
    "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=400",
  ],
  artisan: "Sarah Miller",
  category: "Home Decor",
  tags: ["Handmade", "Ceramic", "Vase"],
  inStock: true,
  maxQuantity: 5,
  specifications: {
    "Material": "Ceramic",
    "Dimensions": "10\" x 6\" x 6\"",
    "Weight": "2.5 lbs",
    "Color": "Natural White",
    "Care": "Hand wash only"
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, Math.min(product.maxQuantity, quantity + change));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // Implement add to cart functionality
    console.log('Added to cart:', { ...product, quantity });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={product.images[selectedImage]}
              alt={product.name}
              sx={{
                width: '100%',
                borderRadius: 2,
                mb: 2,
                objectFit: 'cover',
                aspectRatio: '1/1',
              }}
            />
            <ImageList cols={4} gap={8}>
              {product.images.map((image, index) => (
                <ImageListItem 
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  sx={{ 
                    cursor: 'pointer',
                    border: index === selectedImage ? '2px solid #FFD700' : 'none',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    loading="lazy"
                    style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              By {product.artisan}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviews} reviews)
              </Typography>
            </Box>

            <Typography variant="h4" color="primary" gutterBottom>
              ${product.price}
            </Typography>

            <Box sx={{ my: 2 }}>
              {product.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}>
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={20} />
                  </IconButton>
                  <Typography sx={{ px: 3 }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.maxQuantity}
                  >
                    <Plus size={20} />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {product.maxQuantity} items available
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  sx={{ flex: 1 }}
                >
                  Add to Cart
                </Button>
                <IconButton
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2
                  }}
                >
                  <Heart size={24} />
                </IconButton>
                <IconButton
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2
                  }}
                >
                  <Share2 size={24} />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              bgcolor: '#f8f9fa',
              p: 2,
              borderRadius: 1
            }}>
              <Truck size={20} />
              <Typography variant="body2">
                Free shipping on orders over $100
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Product Details Tabs */}
        <Grid item xs={12}>
          <Paper sx={{ mt: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Specifications" />
              <Tab label="Reviews" />
              <Tab label="Shipping" />
            </Tabs>
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Grid container spacing={2}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">{key}</Typography>
                        <Typography>{value}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                  ))}
                </Grid>
              )}
              {activeTab === 1 && (
                <Typography>Reviews content</Typography>
              )}
              {activeTab === 2 && (
                <Typography>Shipping information</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
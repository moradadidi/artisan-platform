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
  Divider,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  Avatar,
  Rating,
} from '@mui/material';
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Truck, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [cartId, setCartId] = useState('');

  // Fetch user's cart from API on component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;
        const response = await axios.get(`http://127.0.0.1:5000/api/cart/user/${user._id}`);
        console.log("data",response.data[0]);
        // Assume the API returns a single cart document with a populated products array
        if (response.data && response.data[0]) {
          setItems(response.data[0].products);
          setCartId(response.data[0]._id);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, []);

  // Update quantity in local state (ideally, you'd also update the backend)
  const updateQuantity = (item, change) => {
    setItems((prevItems) =>
      prevItems.map((i) => {
        if (i.productId._id === item.productId._id) {
          const newQuantity = Math.max(1, i.quantity + change);
          return { ...i, quantity: newQuantity };
        }
        return i;
      })
    );
  };

  // Remove item from cart in local state (ideally, also update the backend)
  const removeItem = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId._id !== productId));
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;
      axios.delete(`http://127.0.0.1:5000/api/cart/${cartId}/product/${productId}`);
      toast.success('Item removed from cart successfully!');
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Calculate totals using the populated product details
  const subtotal = items.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const shipping = 10;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'first10') {
      setPromoApplied(true);
    }
  };

  // CartItem Component: Uses item.productId for product details and item.quantity for quantity
  const CartItem = ({ item }) => {
    const product = item.productId;
    return (
      <Card sx={{ mb: 2, overflow: 'visible' }}>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} sm={4}>
            <CardMedia
              component="img"
              image={product.images[0] || '/default.png'}
              alt={product.name}
              sx={{
                borderRadius: 2,
                height: 200,
                objectFit: 'cover',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                {product.name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  cursor: 'pointer',
                  '&:hover .artisan-name': { color: 'primary.main' },
                }}
                onClick={() => navigate(`/artisans/${product.user?._id || product.artisan?._id}`)}
              >
                <Avatar
                  src={product.customerId?.profilePicture || product.artisan?.image || '/default.png'}
                  alt={product.customerId?.name || product.customerId?.name || 'Artisan'}
                  sx={{ width: 40, height: 40, mr: 1 }}
                />
                <Box>
                  <Typography
                    variant="subtitle2"
                    className="artisan-name"
                    sx={{ transition: 'color 0.2s ease-in-out' }}
                  >
                    {product.user?.name || product.artisan?.name || 'Unknown Artisan'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MapPin size={14} color="#666" />
                    <Typography variant="caption" color="text.secondary">
                      {product.user?.address || product.artisan?.adresse || 'No address'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                  <Rating value={product.rating || 3} size="small" readOnly />
                  <Typography variant="caption" color="text.secondary" display="block">
                    {product.numReviews || 0} reviews
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="h6"
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                {product.name}
              </Typography>
              {product.category && (
                <Box sx={{ mb: 1 }}>
                  <Chip label={product.category} size="small" />
                </Box>
              )}
              <Typography variant="body2" color="text.secondary" paragraph>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item, -1)}
                      disabled={item.quantity <= 1}
                      sx={{ borderRadius: 0 }}
                    >
                      <Minus size={16} />
                    </IconButton>
                    <Typography sx={{ px: 2, py: 1 }}>{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item, 1)}
                      disabled={item.quantity >= (product.maxQuantity || Infinity)}
                      sx={{ borderRadius: 0 }}
                    >
                      <Plus size={16} />
                    </IconButton>
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => removeItem(product._id)}
                    sx={{ ml: 'auto' }}
                  >
                    <Trash2 size={20} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {['Cart', 'Shipping', 'Payment'].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button component={Link} to="/shop" startIcon={<ArrowLeft />} sx={{ mr: 2 }}>
              Continue Shopping
            </Button>
            <Typography variant="h5">
              Shopping Cart ({items.length} items)
            </Typography>
          </Box>
          {items.length > 0 ? (
            items.map((item) => <CartItem key={item.productId._id} item={item} />)
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Your cart is empty
              </Typography>
              <Typography color="text.secondary" paragraph>
                Add some items to your cart to continue shopping
              </Typography>
              <Button component={Link} to="/shop" variant="contained" color="primary">
                Browse Products
              </Button>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ my: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Subtotal</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Shipping</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography>${shipping.toFixed(2)}</Typography>
                </Grid>
                {promoApplied && (
                  <>
                    <Grid item xs={6}>
                      <Typography color="success.main">Discount</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography color="success.main">
                        -${discount.toFixed(2)}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button variant="outlined" fullWidth onClick={handlePromoCode} disabled={promoApplied}>
                  Apply
                </Button>
                {promoApplied && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    Promo code applied successfully!
                  </Alert>
                )}
              </Box>
              <Divider sx={{ my: 3 }} />
              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="h6">Total</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="h6">${total.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<CreditCard />}
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </Button>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Truck size={20} />
              <Typography variant="body2" color="text.secondary">
                Free shipping on orders over $100
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;

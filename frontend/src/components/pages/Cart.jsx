import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Cart = () => {
  // Set page title
  useEffect(() => {
    document.title = 'Cart - Rarely';
  }, []);

  const navigate = useNavigate();

  // Steps for the checkout
  const steps = ['Cart', 'Shipping', 'Payment'];

  // State for cart items and cart ID
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Shipping form state
  const [shippingData, setShippingData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });


  const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');

  // Fetch the cart from the API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) return;

        const response = await axios.get(
          `http://127.0.0.1:5000/api/cart/user/${user._id}`
        );
        const cartData = response.data; // array of carts

        // If we have at least one cart, store its ID and products
        if (cartData && cartData.length > 0) {
          const cart = cartData[0];
          setCartId(cart._id);
          // cart.products is an array of objects: { productId: { ... }, quantity }
          setItems(cart.products);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  // ---------------------------------------------
  // Update Quantity (local state + backend PATCH)
  // ---------------------------------------------
  const updateQuantity = async (productId, change) => {
    // 1) Find the item in local state
    const itemIndex = items.findIndex((item) => item.productId._id === productId);
    if (itemIndex === -1) return;

    const oldQuantity = items[itemIndex].quantity;
    const newQuantity = Math.max(1, oldQuantity + change);

    // 2) Optimistically update local state
    setItems((prevItems) =>
      prevItems.map((item, idx) =>
        idx === itemIndex ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      // 3) Update quantity in the backend
      await axios.patch(
        `http://127.0.0.1:5000/api/cart/${cartId}/product/${productId}`,
        { quantity: newQuantity }
      );
    } catch (error) {
      // If error, revert local state
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity. Please try again.');

      // Revert to old quantity in local state
      setItems((prevItems) =>
        prevItems.map((item, idx) =>
          idx === itemIndex ? { ...item, quantity: oldQuantity } : item
        )
      );
    }
  };

  // Remove item from the cart
  const removeItem = async (productId) => {
    try {
      // Remove item from local state
      setItems((prevItems) =>
        prevItems.filter((item) => item.productId._id !== productId)
      );
      // Remove from backend
      await axios.delete(
        `http://127.0.0.1:5000/api/cart/${cartId}/product/${productId}`
      );
      toast.success('Item removed from cart successfully!');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  // Calculate subtotal from the items array
  const subtotal = items.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  // Shipping is free if subtotal >= 100, otherwise $10
  const shipping = subtotal >= 100 ? 0 : 10;

  // Apply a 10% discount if promo code is FIRST10
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  // Handle promo code
  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'first10') {
      setPromoApplied(true);
      toast.success('Promo code applied successfully!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  // Next/Back Step Handlers
  const handleNext = () => {
    // If we are on Shipping step, we could validate shippingData here.
    // If we are on Payment step, we could validate paymentData here.
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Place Order
  const handlePlaceOrder = async () => {
    try {
      // Ensure the user is logged in
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user) {
        toast.error('You must be logged in to place an order.');
        return;
      }
  
      // Validate that all required shipping fields are provided
      const { fullName, address, city, state, postalCode, country } = shippingData;
      if (!fullName || !address || !city || !state || !postalCode || !country) {
        toast.error('Please fill out all shipping information.');
        return;
      }
  
      // Combine shipping data into a single shippingAddress string
      const shippingAddress = `${fullName}, ${address}, ${city}, ${state}, ${postalCode}, ${country}`;
  
      // Map the cart items to the order format required by your Order model
      const orderProducts = items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      }));
  
      // Build the order payload
      const payload = {
        customerId: user._id,
        products: orderProducts,
        totalAmount:total,
        shippingAddress,
      };
  
      // Send a POST request to create the order
      const response = await axios.post(
        'http://127.0.0.1:5000/api/orders',
        payload,
        { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
      );
  
      if (response.data.success) {
        toast.success('Order placed successfully!');
        // Optionally clear the cart here or navigate to a confirmation page
        navigate('/order-confirmation');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Error placing order. Please try again.');
    }
  };
  

  // CartItem component: renders each item in the cart
  const CartItem = ({ item }) => {
    const product = item.productId; // Contains all product details
    if (!product) return null;

    return (
      <Card
        sx={{
          mb: 2,
          overflow: 'visible',
          p: 2,
        }}
        variant="outlined"
      >
        <Grid container spacing={2}>
          {/* Product Image */}
          <Grid item xs={12} sm={4}>
            <CardMedia
              component="img"
              image={product.images?.[0] || '/default.png'}
              alt={product.name}
              sx={{
                borderRadius: 2,
                height: 180,
                objectFit: 'cover',
              }}
            />
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} sm={8}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                {product.name}
              </Typography>

              {/* Artisan Info */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  mt: 1,
                  cursor: 'pointer',
                  '&:hover .artisan-name': { color: 'primary.main' },
                }}
                onClick={() =>
                  navigate(`/artisans/${product.user?._id || ''}`)
                }
              >
                <Avatar
                  src={product.user?.profilePicture || '/default.png'}
                  alt={product.user?.name || 'Artisan'}
                  sx={{ width: 40, height: 40, mr: 1 }}
                />
                <Box>
                  <Typography
                    variant="subtitle2"
                    className="artisan-name"
                    sx={{ transition: 'color 0.2s ease-in-out' }}
                  >
                    {product.user?.name || 'Unknown Artisan'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MapPin size={14} color="#666" />
                    <Typography variant="caption" color="text.secondary">
                      {product.user?.address || 'No address'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                  <Rating value={product.rating || 3} size="small" readOnly />
                  <Typography variant="caption" color="text.secondary">
                    {product.numReviews || 0} reviews
                  </Typography>
                </Box>
              </Box>

              {/* Category */}
              {product.category && (
                <Box sx={{ mb: 1 }}>
                  <Chip label={product.category} size="small" />
                </Box>
              )}

              {/* Description */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, flexGrow: 1 }}
              >
                {product.description?.slice(0, 80)}...
              </Typography>

              {/* Price, Quantity, Remove */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" color="primary">
                  ${product.price}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* Quantity Controls */}
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
                      onClick={() => updateQuantity(product._id, -1)}
                      disabled={item.quantity <= 1}
                      sx={{ borderRadius: 0 }}
                    >
                      <Minus size={16} />
                    </IconButton>
                    <Typography sx={{ px: 2, py: 1 }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(product._id, 1)}
                      disabled={item.quantity >= (product.countInStock || Infinity)}
                      sx={{ borderRadius: 0 }}
                    >
                      <Plus size={16} />
                    </IconButton>
                  </Box>

                  {/* Remove Button */}
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

  // Renders the Cart step
  const renderCartStep = () => {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            component={Link}
            to="/shop"
            startIcon={<ArrowLeft />}
            sx={{ mr: 2 }}
          >
            Continue Shopping
          </Button>
          <Typography variant="h5">
            Shopping Cart ({items.length}{' '}
            {items.length === 1 ? 'item' : 'items'})
          </Typography>
        </Box>

        {/* List of Cart Items or Empty State */}
        {items.length > 0 ? (
          items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography color="text.secondary" paragraph>
              Add some items to your cart to continue shopping
            </Typography>
            <Button
              component={Link}
              to="/shop"
              variant="contained"
              color="primary"
            >
              Browse Products
            </Button>
          </Paper>
        )}
      </>
    );
  };

  // Renders the Shipping step
  const renderShippingStep = () => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setShippingData((prev) => ({ ...prev, [name]: value }));
    };

    return (
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Shipping Information
        </Typography>
        <TextField
          label="Full Name"
          name="fullName"
          fullWidth
          sx={{ mb: 2 }}
          value={shippingData.fullName}
          onChange={handleChange}
        />
        <TextField
          label="Address"
          name="address"
          fullWidth
          sx={{ mb: 2 }}
          value={shippingData.address}
          onChange={handleChange}
        />
        <TextField
          label="City"
          name="city"
          fullWidth
          sx={{ mb: 2 }}
          value={shippingData.city}
          onChange={handleChange}
        />
        <TextField
          label="State/Province"
          name="state"
          fullWidth
          sx={{ mb: 2 }}
          value={shippingData.state}
          onChange={handleChange}
        />
        <TextField
          label="Postal Code"
          name="postalCode"
          fullWidth
          sx={{ mb: 2 }}
          value={shippingData.postalCode}
          onChange={handleChange}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Country</InputLabel>
          <Select
            name="country"
            value={shippingData.country}
            onChange={handleChange}
            label="Country"
          >
            <MenuItem value="USA">USA</MenuItem>
            <MenuItem value="Canada">Canada</MenuItem>
            <MenuItem value="UK">UK</MenuItem>
            <MenuItem value="Australia">Australia</MenuItem>
            {/* Add more countries as needed */}
          </Select>
        </FormControl>
      </Box>
    );
  };

  // Renders the Payment step
  const renderPaymentStep = () => {
    

    return (
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Payment Information
        </Typography>
        <TextField
          label="Card Number"
          fullWidth
          sx={{ mb: 2 }}
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <TextField
          label="Expiry (MM/YY)"
          fullWidth
          sx={{ mb: 2 }}
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
        <TextField
          label="CVV"
          fullWidth
          sx={{ mb: 2 }}
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
        />
        <TextField
          label="Name on Card"
          fullWidth
          sx={{ mb: 2 }}
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
      </Box>
    );
  };

  // Renders the content based on activeStep
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return renderCartStep();
      case 1:
        return renderShippingStep();
      case 2:
        return renderPaymentStep();
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  // Decide the button text based on step
  const isLastStep = activeStep === 2;

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
      {/* Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Grid container spacing={4}>
        {/* Main Step Content */}
        <Grid item xs={12} md={8}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowLeft />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={
                isLastStep
                  ? handlePlaceOrder
                  : handleNext
              }
              disabled={
                activeStep === 0 && items.length === 0
              }
              startIcon={isLastStep ? <CreditCard /> : null}
            >
              {isLastStep ? 'Place Order' : 'Next'}
            </Button>
          </Box>
        </Grid>

        {/* Order Summary on the right */}
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
                  <Typography>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </Typography>
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
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handlePromoCode}
                  disabled={promoApplied}
                >
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

            {/* Step-based button changes: 
                We hide "Proceed to Checkout" if user is not on Cart step 
                or if the cart is empty. */}
            {activeStep === 0 && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={items.length === 0}
                sx={{ mb: 2 }}
                onClick={handleNext}
              >
                Proceed to Checkout
              </Button>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

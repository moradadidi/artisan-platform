import { useState } from 'react';
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
} from '@mui/material';
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const cartItems = [
  {
    id: 1,
    name: 'Handcrafted Vase',
    price: 59.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=400',
    artisan: 'Sarah Miller',
    maxQuantity: 5
  },
  {
    id: 2,
    name: 'Ceramic Bowl Set',
    price: 45.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400',
    artisan: 'John Doe',
    maxQuantity: 10
  },
];

const steps = ['Cart', 'Shipping', 'Payment'];

const Cart = () => {
  const [items, setItems] = useState(cartItems);
  const [activeStep, setActiveStep] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQuantity = (id, change) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, Math.min(item.maxQuantity, item.quantity + change));
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'first10') {
      setPromoApplied(true);
    }
  };

  const CartItem = ({ item }) => (
    <Card sx={{ mb: 2, overflow: 'visible' }}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} sm={4}>
          <CardMedia
            component="img"
            image={item.image}
            alt={item.name}
            sx={{ 
              borderRadius: 2,
              height: 200,
              objectFit: 'cover'
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              {item.name}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              By {item.artisan}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              ${item.price}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mt: 'auto',
              gap: 2
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <IconButton
                  size="small"
                  onClick={() => updateQuantity(item.id, -1)}
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
                  onClick={() => updateQuantity(item.id, 1)}
                  disabled={item.quantity >= item.maxQuantity}
                  sx={{ borderRadius: 0 }}
                >
                  <Plus size={16} />
                </IconButton>
              </Box>
              <IconButton
                color="error"
                onClick={() => removeItem(item.id)}
                sx={{ ml: 'auto' }}
              >
                <Trash2 size={20} />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
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
        <Grid item xs={12} md={8}>
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
              Shopping Cart ({items.length} items)
            </Typography>
          </Box>

          {items.length > 0 ? (
            items.map((item) => (
              <CartItem key={item.id} item={item} />
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
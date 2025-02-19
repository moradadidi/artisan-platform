import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CheckCircle size={80} color="#4caf50" />
        </Box>
        <Typography variant="h4" gutterBottom>
          Thank You for Your Order!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Your order has been placed successfully. A confirmation email has been sent to your email address.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/shop')}>
          Continue Shopping
        </Button>
      </Paper>
    </Container>
  );
};

export default OrderConfirmation;

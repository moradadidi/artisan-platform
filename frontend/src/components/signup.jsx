import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MdEmail, MdLock, MdPerson } from 'react-icons/md';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Registration successful!');
      console.table(response.data);
      console.log('User created');
      // Optionally redirect to login page here
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Registration failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5', // Light grey background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        {/* Logo Section */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img 
            src="/path-to-your-logo.png" 
            alt="Logo" 
            style={{ maxWidth: '150px', marginBottom: '10px' }} 
          />
        </Box>
        <Typography variant="h4" align="center" gutterBottom>
          Create your account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            type="text"
            autoComplete="name"
            required
            margin="normal"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdPerson />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            required
            margin="normal"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdEmail />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            margin="normal"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLock />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            margin="normal"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLock />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" style={{ color: '#757575' }}>
            Already have an account?
          </Typography>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" sx={{ mt: 1, color: '#1976d2', borderColor: '#1976d2' }}>
              Sign in instead
            </Button>
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}

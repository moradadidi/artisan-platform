import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MdEmail, MdLock } from 'react-icons/md';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../UserAuthContext';



export default function LoginForm() {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useUserAuth();

    const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/api/login', formData);
      toast.success('Login successful!');
      // Handle successful login (e.g., store token, redirect)
      console.table(response.data);
      console.log(response.data.user.role);
      if (response.data.user.role === "artisan"){
        navigate('/dashboard');

      }else{
        navigate('/');}
      login(response.data.user, response.data.token);
      // Optionally redirect to another page
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Login failed');
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
        backgroundColor: '#f5f5f5', // light grey background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        {/* Logo Area */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img 
            src="../../public/logo.png" 
            alt="Logo" 
            style={{ maxWidth: '150px', marginBottom: '10px' , textAlign: 'center' , marginLeft: 'auto', marginRight: 'auto'}} 
          />
        </Box>
        <Typography variant="h4" align="center" gutterBottom>
          Login to your account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
            placeholder="Enter your email"
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
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
            placeholder="Enter your password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLock />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" style={{ color: '#1976d2' }}>
                Forgot your password?
              </Typography>
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2, backgroundColor: '#fbc02d', '&:hover': { backgroundColor: '#f9a825' } }}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" style={{ color: '#757575' }}>
            Don&apos;t have an account?
          </Typography>
          <Link to="/register" style={{ textDecoration: 'none', color: '#f9a825'  }}>
              Create new account
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}

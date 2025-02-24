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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

// --- Logo Component ---
const Logo = () => (
  <Box sx={{ textAlign: 'center' }}>
    <img
      src="/logo.png"
      alt="Logo"
      style={{ maxWidth: '150px', margin: '0 auto' }}
    />
  </Box>
);

// --- Main Register Form Component ---
export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    profilePicture: './default.png',
  });
  const [loading, setLoading] = useState(false);

  // Adjusted container and paper styles to reduce overall height
  const containerStyles = {
    minHeight: '80vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: 2,
    py: 2,
  };

  const paperStyles = { px: 3, py: 1, maxWidth: 400, width: '100%' };

  const buttonStyles = {
    mt: 2,
    mb: 2,
    backgroundColor: '#fbc02d',
    '&:hover': { backgroundColor: '#f9a825' },
  };

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle role select changes
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  // Handle form submission with email verification instruction
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
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
      const response = await axios.post('https://rarely.onrender.com/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      toast.success('Registration successful! Please check your email to verify your account.');
      // Optionally redirect to login page
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("A user with that email already exists.");
        } else if (error.response?.status === 500) {
          toast.error("Server error occurred during registration. Please try again later.");
        } else {
          toast.error(error.response?.data?.message || 'Registration failed');
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <Box sx={containerStyles}>
      <Paper elevation={3} sx={paperStyles}>
        <Logo />
        <Typography variant="h4" align="center" gutterBottom>
          Create your account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* Full Name Field */}
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

          {/* Email Address Field */}
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

          {/* Password Field */}
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

          {/* Confirm Password Field */}
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

          {/* Role Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleRoleChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="artisan">artisan</MenuItem>
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={buttonStyles}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Box>

        {/* Link to Login */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#757575' }}>
            Already have an account?
          </Typography>
          <Link to="/login" style={{ textDecoration: 'none', color: '#f9a825' }}>
            Sign in instead
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}

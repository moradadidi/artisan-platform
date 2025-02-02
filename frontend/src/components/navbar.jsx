import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User, Trees } from 'lucide-react';
import {
  Badge,
  TextField,
  Drawer,
  List,
  ListItem,
  IconButton,
  Box,
  Typography,
} from '@mui/material';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = 2; // Example cart count

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Discover', 'Shop', 'Artisans', 'Collections', 'About'];

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: isScrolled ? '#ffffff' : 'transparent',
        boxShadow: isScrolled ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <Trees size={24} sx={{ color: '#FBBF24', mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FBBF24' }}>
            RARELY
          </Typography>
        </Box>

        {/* Search Bar (visible on md and up) */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'block' },
            mx: 2,
            maxWidth: 400,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search artisans and products..."
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: '#6B7280' }} />
              ),
            }}
          />
        </Box>

        {/* Navigation Links (desktop) */}
        <Box
          component="nav"
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 3,
            alignItems: 'center',
          }}
        >
          {navItems.map((item) => (
            <Typography
              key={item}
              component={Link}
              to={`/${item.toLowerCase()}`}
              sx={{
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#4B5563',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: '#FBBF24',
                },
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        {/* Icons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            ml: { xs: 0, md: 2 },
          }}
        >
          <IconButton component={Link} to="/cart">
            <Badge badgeContent={cartItemCount} color="warning">
              <ShoppingCart sx={{ color: '#1F2937' }} />
            </Badge>
          </IconButton>
          <IconButton component={Link} to="/profile">
            <User sx={{ color: '#1F2937' }} />
          </IconButton>
          {/* Mobile Menu Toggle */}
          <IconButton
            sx={{ display: { md: 'none' } }}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu sx={{ color: '#1F2937' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Mobile Menu Drawer */}
      <Drawer
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        PaperProps={{ sx: { width: 250 } }}
      >
        <List>
          {navItems.map((item) => (
            <ListItem
              key={item}
              button
              component={Link}
              to={`/${item.toLowerCase()}`}
              onClick={() => setIsMobileMenuOpen(false)}
              sx={{
                fontSize: '1rem',
                fontWeight: 500,
                color: '#1F2937',
              }}
            >
              {item}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

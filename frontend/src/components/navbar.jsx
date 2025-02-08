import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  InputBase, 
  Box, 
  Container, 
  IconButton, 
  Badge, 
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Typography,
  Drawer
} from '@mui/material';
import { 
  ShoppingCart, 
  Heart, 
  Search, 
  Menu as MenuIcon,
  LogOut,
  Settings,
  User,
  Package,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  X as CloseIcon
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if a given route is active
  const isActiveRoute = (path) => location.pathname === path;

  // Profile menu handlers
  const handleProfileClick = (event) => {
    setProfileMenu(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileMenu(null);
  };

  const handleLogout = () => {
    // Implement logout logic here (e.g., clear tokens, update state)
    handleProfileClose();
  };

  // Reusable NavLink component with active styling
  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      style={{
        textDecoration: 'none',
        color: isActiveRoute(to) ? '#FFD700' : '#333',
        fontSize: '0.95rem',
        fontWeight: 500,
        padding: '8px 16px',
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: isActiveRoute(to)
          ? 'rgba(255, 215, 0, 0.1)'
          : 'transparent',
      }}
    >
      {children}
    </Link>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'white',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ minHeight: '64px', px: { xs: 2, sm: 4 } }}>
          {/* Mobile Menu Button */}
          

          {/* Logo and Collapse Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                marginRight: '8px',
              }}
            >
                         <Box
            component="img"
            src="/logo.png" // Ensure your logo.png is in your public folder
            alt="RARELY Logo"
            sx={{
              height: 50,
              width: 'auto',
            }}
          />
            </Link>
            {/* Collapse Toggle (desktop only) */}
           
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              padding: '8px 16px',
              flex: '1 1 auto',
              maxWidth: '600px',
              transition: 'all 0.2s ease-in-out',
              '&:focus-within': {
                backgroundColor: '#fff',
                boxShadow: '0 0 0 2px #FFD700',
              },
            }}
          >
            <Search size={20} color="#666" />
            <InputBase
              placeholder="Search artisans and products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                ml: 1,
                flex: 1,
                '& input': {
                  padding: '4px 0',
                  fontSize: '0.95rem',
                  '&::placeholder': {
                    color: '#666',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          {/* Navigation Links - Desktop (only when not collapsed) */}
          {!isCollapsed && (
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 1,
                ml: 4,
              }}
            >
              <NavLink to="/discover">Discover</NavLink>
              <NavLink to="/shop">Shop</NavLink>
              <NavLink to="/artisans">Artisans</NavLink>
              <NavLink to="/collections">Collections</NavLink>
              <NavLink to="/about">About</NavLink>
            </Box>
          )}

          {/* Icons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              ml: 'auto',
            }}
          >
            <IconButton
              component={Link}
              to="/favorites"
              sx={{
                color: isActiveRoute('/favorites') ? '#FFD700' : '#333',
                padding: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <Badge badgeContent={0} color="error">
                <Heart size={22} />
              </Badge>
            </IconButton>
            <IconButton
              component={Link}
              to="/cart"
              sx={{
                color: isActiveRoute('/cart') ? '#FFD700' : '#333',
                padding: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <Badge
                badgeContent={2}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#FFD700',
                    color: '#000',
                  },
                }}
              >
                <ShoppingCart size={22} />
              </Badge>
            </IconButton>

            {/* Profile Menu Trigger */}
            <IconButton
              onClick={handleProfileClick}
              sx={{
                padding: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'primary.main',
                }}
              >
                <User size={20} />
              </Avatar>
            </IconButton>
            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={profileMenu}
              open={Boolean(profileMenu)}
              onClose={handleProfileClose}
              onClick={handleProfileClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  width: 220,
                  '& .MuiMenuItem-root': {
                    py: 1,
                    px: 2,
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" noWrap>
                  John Doe
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  john.doe@example.com
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => navigate('/profile')}>
                <ListItemIcon>
                  <User size={20} />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={() => navigate('/orders')}>
                <ListItemIcon>
                  <Package size={20} />
                </ListItemIcon>
                My Orders
              </MenuItem>
              <MenuItem onClick={() => navigate('/payment-methods')}>
                <ListItemIcon>
                  <CreditCard size={20} />
                </ListItemIcon>
                Payment Methods
              </MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>
                <ListItemIcon>
                  <Settings size={20} />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogOut size={20} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
          <IconButton
            sx={{ display: { sm: 'none' }, mr: 2 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon size={24} />
          </IconButton>
        </Toolbar>

        {/* Mobile Menu (Drawer) */}        
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{ sx: { width: 250 , height: '50%' } }}
          // zIndex={9999}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <CloseIcon size={24} />
            </IconButton>
          </Box>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <NavLink to="/discover">Discover</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/artisans">Artisans</NavLink>
            <NavLink to="/collections">Collections</NavLink>
            <NavLink to="/about">About</NavLink>
          </Box>
        </Drawer>
      </Container>
    </AppBar>
  );
};

export default Navbar;

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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useScrollTrigger,
  Slide,
  Button,
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
  X,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsMenu, setNotificationsMenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveRoute = (path) => location.pathname === path;

  const handleProfileClick = (event) => {
    setProfileMenu(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileMenu(null);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsMenu(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsMenu(null);
  };

  const handleLogout = () => {
    handleProfileClose();
    // Implement logout logic
  };

  const navItems = [
    { path: '/discover', label: 'Discover' },
    { path: '/shop', label: 'Shop' },
    { path: '/artisans', label: 'Artisans' },
    { path: '/collections', label: 'Collections' },
    { path: '/about', label: 'About' },
  ];

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: 'white',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          <Container maxWidth="xl">
            <Toolbar 
              sx={{ 
                minHeight: { xs: '56px', sm: '64px' }, 
                px: { xs: 1, sm: 2, md: 4 }, 
                gap: { xs: 1, sm: 2 }
              }}
            >
              {/* Mobile Menu Button */}
              <IconButton
                sx={{ 
                  display: { md: 'none' },
                  mr: 0.5
                }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <MenuIcon size={22} />
              </IconButton>

              {/* Logo */}
              <Link to="/" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                flexShrink: 0
              }}>
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

              {/* Search Bar - Desktop */}
              <Box sx={{ 
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
                  boxShadow: '0 0 0 2px #FFD700'
                }
              }}>
                <Search size={18} color="#666" />
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
                        opacity: 1
                      }
                    }
                  }}
                />
              </Box>

              {/* Search Icon - Mobile */}
              <IconButton 
                sx={{ 
                  display: { xs: 'flex', md: 'none' },
                  ml: 'auto'
                }}
                onClick={() => setSearchOpen(true)}
              >
                <Search size={22} />
              </IconButton>

              {/* Navigation Links - Desktop */}
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'center', 
                gap: 0.5,
                ml: 4,
                flexShrink: 0
              }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: isActiveRoute(item.path) ? '#FFD700' : '#333',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: isActiveRoute(item.path) ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.05)',
                      },
                      textTransform: 'none'
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              {/* Icons */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.5, sm: 1 }, 
                ml: { xs: 0, md: 'auto' },
                flexShrink: 0
              }}>
                <IconButton 
                  component={Link} 
                  to="/favorites"
                  sx={{ 
                    color: isActiveRoute('/favorites') ? '#FFD700' : '#333',
                    padding: { xs: '6px', sm: '8px' },
                  }}
                >
                  <Badge badgeContent={0} color="error">
                    <Heart size={20} />
                  </Badge>
                </IconButton>
                <IconButton 
                  component={Link} 
                  to="/cart"
                  sx={{ 
                    color: isActiveRoute('/cart') ? '#FFD700' : '#333',
                    padding: { xs: '6px', sm: '8px' },
                  }}
                >
                  <Badge 
                    badgeContent={2} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#FFD700',
                        color: '#000'
                      }
                    }}
                  >
                    <ShoppingCart size={20} />
                  </Badge>
                </IconButton>

                {/* Notifications */}
                <IconButton
                  onClick={handleNotificationsClick}
                  sx={{ 
                    padding: { xs: '6px', sm: '8px' },
                    display: { xs: 'none', sm: 'flex' }
                  }}
                >
                  <Badge 
                    badgeContent={3} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#FFD700',
                        color: '#000'
                      }
                    }}
                  >
                    <Bell size={20} />
                  </Badge>
                </IconButton>
                
                {/* Profile Menu */}
                <IconButton 
                  onClick={handleProfileClick}
                  sx={{ 
                    padding: { xs: '6px', sm: '8px' },
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: { xs: 28, sm: 32 }, 
                      height: { xs: 28, sm: 32 },
                      backgroundColor: 'primary.main'
                    }}
                  >
                    <User size={18} />
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
                    elevation: 2,
                    sx: {
                      mt: 1.5,
                      width: 220,
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1.5,
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
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{ 
          '& .MuiDrawer-paper': { 
            width: '100%',
            maxWidth: 360
          }
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </IconButton>
          </Box>

          <List sx={{ flex: 1 }}>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton 
                  component={Link}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: isActiveRoute(item.path) ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                  }}
                >
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      style: {
                        color: isActiveRoute(item.path) ? '#FFD700' : '#333',
                        fontWeight: 500
                      }
                    }}
                  />
                  <ChevronRight size={20} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  mr: 2,
                  backgroundColor: 'primary.main'
                }}
              >
                <User size={24} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1">John Doe</Typography>
                <Typography variant="body2" color="text.secondary">
                  john.doe@example.com
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              startIcon={<LogOut size={18} />}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Mobile Search Drawer */}
      <Drawer
        anchor="top"
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        sx={{ 
          display: { md: 'none' },
          '& .MuiDrawer-paper': { 
            pt: 8
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '8px 16px',
          }}>
            <Search size={20} color="#666" />
            <InputBase
              autoFocus
              placeholder="Search artisans and products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
            />
            <IconButton size="small" onClick={() => setSearchOpen(false)}>
              <X size={20} />
            </IconButton>
          </Box>
        </Box>
      </Drawer>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsMenu}
        open={Boolean(notificationsMenu)}
        onClose={handleNotificationsClose}
        onClick={handleNotificationsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 2,
          sx: {
            mt: 1.5,
            width: 320,
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have 3 new notifications
          </Typography>
        </Box>
        <Divider />
        <MenuItem sx={{ py: 2 }}>
          <Box>
            <Typography variant="subtitle2">
              New order received
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Order #1234 has been placed
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem sx={{ py: 2 }}>
          <Box>
            <Typography variant="subtitle2">
              Product back in stock
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ceramic Vase is now available
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            color="primary"
            sx={{ textTransform: 'none' }}
          >
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default Navbar;
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from '@mui/material';
import { ShoppingBag, Star, Package, DollarSign } from 'lucide-react';

const ArtisanDash = () => {
  // Stats to display at the top of the dashboard
  const stats = [
    { label: 'Total Sales', value: '$2,345', icon: <DollarSign size={28} />, bgColor: '#FFA726' },
    { label: 'Active Orders', value: '12', icon: <Package size={28} />, bgColor: '#66BB6A' },
    { label: 'Reviews', value: '4.8 ★', icon: <Star size={28} />, bgColor: '#42A5F5' },
    { label: 'Products', value: '56', icon: <ShoppingBag size={28} />, bgColor: '#AB47BC' },
  ];

  // Recent activities array
  const activities = [
    {
      id: 1,
      title: 'New order received',
      subtitle: 'Order #123456 • $149.99',
      time: '2 minutes ago',
      icon: <ShoppingBag size={24} />,
      iconBg: '#FFA726',
    },
    {
      id: 2,
      title: 'New 5-star review',
      subtitle: 'For Ceramic Bowl Set',
      time: '1 hour ago',
      icon: <Star size={24} />,
      iconBg: '#42A5F5',
    },
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome Back, Artisan!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Here's a quick overview of your performance today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card
              sx={{
                backgroundColor: stat.bgColor,
                color: 'white',
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity Section */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <List>
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                  '&:hover': { backgroundColor: '#eeeeee' },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: activity.iconBg }}>
                    {activity.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {activity.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary">
                        {activity.subtitle}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        {activity.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ArtisanDash;

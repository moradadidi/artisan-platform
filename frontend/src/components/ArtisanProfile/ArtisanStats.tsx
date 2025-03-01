import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { ArtisanData } from '../../types/index';

interface ArtisanStatsProps {
  stats: ArtisanData['stats'];
}

const ArtisanStats: React.FC<ArtisanStatsProps> = ({ stats }) => {
  const statItems = [
    { label: 'Total Sales', value: stats?.totalSales || 0 },
    { label: 'Completed Orders', value: stats?.completedOrders || 0 },
    { label: 'Average Rating', value: stats?.averageRating || 0 },
    { label: 'Response Time', value: stats?.responseTime || 'N/A' },
  ];

  return (
    <Grid container spacing={3}>
      {statItems.map((item, index) => (
        <Grid item xs={6} sm={3} key={index}>
          <Box 
            sx={{ 
              textAlign: 'center',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography variant="h4" color="primary">
              {item.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default ArtisanStats;
import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Divider } from '@mui/material';
import axios from 'axios';
import CountUp from 'react-countup';
import { ArtisanData } from '../../types/index';
import { useParams } from 'react-router-dom';

const ArtisanStats: React.FC = () => {
  const [stats, setStats] = useState<ArtisanData['stats']>({
    totalSales: 0,
    completedOrders: 0,
    averageRating: 0,
  });
  const { id } = useParams();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/users/stats/${id}`
        );
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [id]);

  const statItems = [
    { label: 'Total Sales', value: stats?.totalSales || 0 },
    { label: 'Completed Orders', value: stats?.completedOrders || 0 },
    { label: 'Average Rating', value: stats?.averageRating || 0 },
  ];

  return (
    <Grid container spacing={3}>
      {statItems.map((item, index) => (
        <Grid item xs={6} sm={4} key={index}>
          <Box
            sx={{
              textAlign: 'center',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <Typography variant="h4" color="primary">
              {item.label === 'Average Rating' ? (
                <CountUp start={0} end={item.value} duration={1} decimals={1} />
              ) : (
                <CountUp start={0} end={item.value} duration={1} />
              )}
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

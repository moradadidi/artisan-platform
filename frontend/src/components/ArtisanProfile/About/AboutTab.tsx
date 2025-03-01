import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { ArtisanData } from '../../../types';

interface AboutTabProps {
  artisanData: ArtisanData;
}

const AboutTab: React.FC<AboutTabProps> = ({ artisanData }) => {
  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        About {artisanData.name}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Typography variant="body1" paragraph>
        {artisanData.bio}
      </Typography>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Specialty
      </Typography>
      <Typography variant="body1" paragraph>
        {artisanData.specialty || 'Artisanal Crafts'}
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Location
      </Typography>
      <Typography variant="body1" paragraph>
        {artisanData.address}
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Experience
      </Typography>
      <Typography variant="body1">
        With {artisanData.stats?.completedOrders || 0} completed orders and an average rating of {artisanData.stats?.averageRating || 0}, 
        {artisanData.name} has established a reputation for quality craftsmanship and customer satisfaction.
      </Typography>
    </Paper>
  );
};

export default AboutTab;
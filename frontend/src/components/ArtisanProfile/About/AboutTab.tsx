import React from 'react';
import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { ArtisanData } from '../../../types';

interface AboutTabProps {
  artisanData: ArtisanData;
}

const AboutTab: React.FC<AboutTabProps> = ({ artisanData }) => {
  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        About {artisanData.name || 'the Artisan'}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {/* Bio Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
          Bio
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {artisanData.bio || 'No bio available at the moment.'}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Specialty Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
            Specialty
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {artisanData.specialty || 'Artisanal Crafts'}
          </Typography>
        </Grid>

        {/* Location Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
            Location
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {artisanData.address || 'No location provided.'}
          </Typography>
        </Grid>
      </Grid>
      
      {/* Experience Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
          Experience
        </Typography>
        <Typography variant="body1" color="text.secondary">
          With {artisanData.stats?.completedOrders ?? 0} completed orders and an average rating of {artisanData.stats?.averageRating ?? 0}, {artisanData.name || 'this artisan'} has established a reputation for quality craftsmanship and customer satisfaction.
        </Typography>
      </Box>
    </Paper>
  );
};

export default AboutTab;

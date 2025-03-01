import React from 'react';
import { Box, Typography, Rating, LinearProgress, Paper } from '@mui/material';
import { Review } from '../../../types';

interface ReviewSummaryProps {
  reviews: Review[];
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return null;
  }

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  // Count ratings by star level
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating >= 4 && r.rating < 5).length,
    3: reviews.filter(r => r.rating >= 3 && r.rating < 4).length,
    2: reviews.filter(r => r.rating >= 2 && r.rating < 3).length,
    1: reviews.filter(r => r.rating >= 1 && r.rating < 2).length,
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ textAlign: 'center', mr: 4 }}>
          <Typography variant="h2" color="primary" fontWeight="bold">
            {averageRating.toFixed(1)}
          </Typography>
          <Rating value={averageRating} precision={0.1} readOnly size="large" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          {[5, 4, 3, 2, 1].map((star) => (
            <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" sx={{ width: 20 }}>
                {star}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(ratingCounts[star as keyof typeof ratingCounts] / reviews.length) * 100} 
                sx={{ 
                  mx: 1, 
                  flex: 1, 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: star >= 4 ? 'success.main' : star >= 3 ? 'warning.main' : 'error.main'
                  }
                }} 
              />
              <Typography variant="body2" sx={{ width: 30 }}>
                {ratingCounts[star as keyof typeof ratingCounts]}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default ReviewSummary;
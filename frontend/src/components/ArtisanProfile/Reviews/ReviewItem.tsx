import React from 'react';
import { Box, Typography, Avatar, Rating, Paper } from '@mui/material';
import { Review } from '../../../types';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  console.log(review);
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Avatar 
          src={review.customerId.profilePicture} 
          alt={review.customerId.name}
          sx={{ mr: 2 , cursor: 'pointer' }}
          onClick={() => {
            window.location.href = `/artisans/${review.customerId._id}`
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {review.customerId.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(review.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Rating value={review.rating} precision={0.5} size="small" readOnly sx={{ mb: 1 }} />
          <Typography variant="body2">
            {review.comment}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ReviewItem;
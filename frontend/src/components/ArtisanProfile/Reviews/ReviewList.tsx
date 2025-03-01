import React from 'react';
import { Box, Typography, CircularProgress, Divider } from '@mui/material';
import ReviewItem from './ReviewItem';
import { Review } from '../../../types';

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ py: 2 }}>
        Error loading reviews: {error}
      </Typography>
    );
  }

  if (reviews.length === 0) {
    return (
      <Typography variant="body1" sx={{ py: 4, textAlign: 'center' }}>
        No reviews yet. Be the first to leave a review!
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Customer Reviews ({reviews.length})
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </Box>
  );
};

export default ReviewList;
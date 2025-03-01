import React, { useState, useEffect } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import ReviewSummary from './ReviewSummary';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { Review, ReviewFormData } from '../../../types';

interface ReviewsTabProps {
  artisanId: string;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ artisanId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://rarely.onrender.com/api/artisanreviews/artisan/${artisanId}`);
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [artisanId]);

  const handleSubmitReview = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      await axios.post('https://rarely.onrender.com/api/artisanreviews', {
        artisanId,
        rating: data.rating,
        comment: data.comment
      });
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Your review has been submitted successfully!',
        severity: 'success'
      });
      
      // Refresh reviews list
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      setNotification({
        open: true,
        message: 'Failed to submit your review. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <ReviewForm onSubmit={handleSubmitReview} isSubmitting={isSubmitting} />
      <ReviewSummary reviews={reviews} />
      <ReviewList reviews={reviews} loading={loading} error={error} />
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewsTab;
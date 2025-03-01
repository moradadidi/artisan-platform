import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  TextField, 
  Button, 
  Paper,
  CircularProgress
} from '@mui/material';
import { ReviewFormData } from '../../../types';

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>;
  isSubmitting: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [ratingError, setRatingError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      setRatingError(true);
      return;
    }
    
    await onSubmit({
      rating,
      comment
    });
    
    // Reset form after successful submission
    setRating(null);
    setComment('');
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Write a Review
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography component="legend" sx={{ mb: 1 }}>
            Your Rating*
          </Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(_, newValue) => {
              setRating(newValue);
              setRatingError(false);
            }}
            precision={0.5}
            size="large"
          />
          {ratingError && (
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              Please select a rating
            </Typography>
          )}
        </Box>
        <TextField
          label="Your Review"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this artisan..."
          sx={{ mb: 2 }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={isSubmitting}
          sx={{
            transition: 'transform 0.2s ease-in-out',
            '&:not(:disabled):hover': {
              transform: 'translateY(-2px)'
            }
          }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default ReviewForm;
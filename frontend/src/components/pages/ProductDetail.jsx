import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  Rating,
  Chip,
  Divider,
  Paper,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
  CircularProgress,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Share2,
  Truck,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();

  // -------------------
  // State Variables
  // -------------------
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Favorites tracking
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  // New review states
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Control the review form pop-out (modal)
  const [showReviewModal, setShowReviewModal] = useState(false);

  // NEW: Review search query state
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');

  // Retrieve user & token from sessionStorage
  const user = JSON.parse(sessionStorage.getItem('user'));
  const token = sessionStorage.getItem('token');

  // -------------------
  // Data Fetching
  // -------------------
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://rarely.onrender.com/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product.');
      }
      const data = await response.json();
      setProduct(data);

      // Check if product is in user's favorites
      if (user && token) {
        const favResponse = await axios.get(
          `https://rarely.onrender.com/api/favorites/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const favoritesData = favResponse.data;
        const foundFavorite = favoritesData.find(
          (fav) => fav.product._id === data._id
        );
        if (foundFavorite) {
          setIsFavorite(true);
          setFavoriteId(foundFavorite._id);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `https://rarely.onrender.com/api/reviews/product/${id}`
      );
      setReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  // -------------------
  // Favorites
  // -------------------
  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('You must be logged in to favorite products.');
      return;
    }
    try {
      if (!isFavorite) {
        const response = await axios.post(
          'https://rarely.onrender.com/api/favorites',
          { product: product._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Added to favorites');
        setIsFavorite(true);
        setFavoriteId(response.data._id);
      } else {
        await axios.delete(
          `https://rarely.onrender.com/api/favorites/${favoriteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Removed from favorites');
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      console.error('Error toggling favorites:', error);
      toast.error('Error updating favorites. Please try again.');
    }
  };

  // -------------------
  // Cart
  // -------------------
  const handleAddToCart = async () => {
    if (!user) {
      toast.error('You must be logged in to add products to your cart.');
      return;
    }
    try {
      const payload = {
        customerId: user._id,
        products: [{ productId: product._id, quantity }],
        totalAmount: product.price * quantity,
      };
      await axios.post('https://rarely.onrender.com/api/cart', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart. Please try again.');
    }
  };

  // -------------------
  // Quantity
  // -------------------
  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(
      1,
      Math.min(product?.maxQuantity || Infinity, quantity + change)
    );
    setQuantity(newQuantity);
  };

  // -------------------
  // Tabs
  // -------------------
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // -------------------
  // Submit Review (Modal)
  // -------------------
  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('You must be logged in to add a review.');
      return;
    }
    if (!newReviewRating || !newReviewComment.trim()) {
      toast.error('Please provide a rating and comment.');
      return;
    }
    try {
      await axios.post(
        'https://rarely.onrender.com/api/reviews',
        {
          productId: id,
          customerId: user._id,
          rating: newReviewRating,
          comment: newReviewComment.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review added successfully!');
      setNewReviewRating(0);
      setNewReviewComment('');
      setShowReviewModal(false);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to add review. Please try again.');
    }
  };

  // -------------------
  // Lifecycle
  // -------------------
  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Product not found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We couldn’t find the product you’re looking for. Please try again later.
        </Typography>
      </Container>
    );
  }

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // NEW: Filter reviews based on search query
  const filteredReviews = reviews.filter((review) => {
    const searchLower = reviewSearchQuery.toLowerCase();
    return (
      review.comment.toLowerCase().includes(searchLower) ||
      (review.customerId?.name &&
        review.customerId.name.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            {product.images && product.images.length > 0 && (
              <Box
                component="img"
                src={product.images[selectedImage]}
                alt={product.name}
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  mb: 2,
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
              />
            )}
            <ImageList cols={4} gap={8}>
              {product.images?.map((image, index) => (
                <ImageListItem
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    cursor: 'pointer',
                    border:
                      index === selectedImage ? '2px solid #FFD700' : 'none',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    loading="lazy"
                    style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              By {product?.user?.name || 'Unknown Artisan'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={averageRating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({reviews.length} reviews)
              </Typography>
            </Box>

            <Typography variant="h4" color="primary" gutterBottom>
              ${product.price}
            </Typography>

            <Box sx={{ my: 2 }}>
              {product.tags?.map((tag) => (
                <Chip key={tag} label={tag} sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            {/* Quantity & Add to Cart */}
            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={20} />
                  </IconButton>
                  <Typography sx={{ px: 3 }}>{quantity}</Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.maxQuantity || Infinity)}
                  >
                    <Plus size={20} />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {product.maxQuantity || 0} items available
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  sx={{ flex: 1 }}
                >
                  Add to Cart
                </Button>

                <Tooltip
                  title={
                    isFavorite
                      ? 'Remove from Favorites'
                      : 'Add to Favorites'
                  }
                >
                  <IconButton
                    onClick={handleFavoriteToggle}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      p: 2,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Heart
                      size={24}
                      fill={isFavorite ? '#ff4081' : 'none'}
                      color={isFavorite ? '#ff4081' : '#666'}
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Share Product">
                  <IconButton
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      p: 2,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Product link copied to clipboard!');
                    }}
                  >
                    <Share2 size={24} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#f8f9fa',
                p: 2,
                borderRadius: 1,
              }}
            >
              <Truck size={20} />
              <Typography variant="body2">
                Free shipping on orders over $100
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Product Details Tabs */}
        <Grid item xs={12}>
          <Paper sx={{ mt: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Specifications" />
              <Tab label="Reviews" />
              <Tab label="Shipping" />
            </Tabs>
            <Box sx={{ p: 3 }}>
              {/* Specifications Tab */}
              {activeTab === 0 && (
                <Grid container spacing={2}>
                  {product.specifications &&
                    Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography color="text.secondary">
                              {key}
                            </Typography>
                            <Typography>{value}</Typography>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                        </Grid>
                      )
                    )}
                </Grid>
              )}

              {/* Reviews Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Reviews
                  </Typography>
                  {/* NEW: Search field for reviews */}
                  <TextField 
                    fullWidth
                    variant="outlined"
                    placeholder="Search reviews..."
                    value={reviewSearchQuery}
                    onChange={(e) => setReviewSearchQuery(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ mb: 3 }}>
                    {filteredReviews.length > 0 ? (
                      filteredReviews.map((review) => (
                        <Paper
                          key={review._id}
                          sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                            boxShadow: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Avatar
                              src={
                                review.customerId?.profilePicture ||
                                '/default-avatar.png'
                              }
                              alt={review.customerId?.name || 'Anonymous'}
                              sx={{ mr: 2 }}
                            />
                            <Box>
                              <Typography variant="subtitle2">
                                {review.customerId?.name || 'Anonymous'}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(review.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating
                              value={review.rating}
                              readOnly
                              size="small"
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ fontStyle: 'italic', mt: 1 }}
                          >
                            {review.comment}
                          </Typography>
                        </Paper>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No reviews match your search.
                      </Typography>
                    )}
                  </Box>

                  {user ? (
                    <Button
                      variant="outlined"
                      onClick={() => setShowReviewModal(true)}
                    >
                      Write a Review
                    </Button>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Please log in to write a review.
                    </Typography>
                  )}
                </Box>
              )}

              {/* Shipping Tab */}
              {activeTab === 2 && (
                <Typography>
                  This product ships worldwide. Delivery times vary by location.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Review Form Modal */}
      <Dialog
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Your Rating
            </Typography>
            <Rating
              name="new-review-rating"
              value={newReviewRating}
              onChange={(e, newValue) => setNewReviewRating(newValue)}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your review"
            value={newReviewComment}
            onChange={(e) => setNewReviewComment(e.target.value)}
            sx={{ mt: 3 }}
          />
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => setShowReviewModal(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmitReview}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetail;

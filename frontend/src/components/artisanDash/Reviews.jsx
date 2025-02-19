import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ChevronLeft,
  Search,
} from 'lucide-react';
import axios from 'axios';

const Reviews = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user'));

  // Fetch reviews from API using axios
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/api/reviews/artisan/${user._id}/products`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviews(res.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [user._id, token]);

  // Define filter options
  const filters = [
    { label: 'All Reviews', value: 'all' },
    { label: '5 Stars', value: '5' },
    { label: '4 Stars', value: '4' },
    { label: '3 Stars', value: '3' },
    { label: 'Needs Response', value: 'pending' },
  ];

  // Map API review data to our expected structure with defaults
  const mappedReviews = reviews.map((r) => ({
    id: r._id,
    productName: r.productId?.name || 'Unknown Product',
    productImage:
      r.productId?.images && r.productId.images.length > 0
        ? r.productId.images[0]
        : 'https://via.placeholder.com/150',
    customerName: r.customerId?.name || 'Anonymous',
    reviewerPhoto:
      r.customerId?.profilePicture || 'https://via.placeholder.com/40',
    rating: r.rating || 0,
    date: new Date(r.createdAt).toLocaleDateString(),
    comment: r.comment,
    status: r.status || 'Pending',
  }));

  // Filter reviews based on selected filter and search query
  const filteredReviews = mappedReviews.filter((review) => {
    if (selectedFilter === '5' && review.rating !== 5) return false;
    if (selectedFilter === '4' && review.rating !== 4) return false;
    if (selectedFilter === '3' && review.rating !== 3) return false;
    if (selectedFilter === 'pending' && review.status.toLowerCase() !== 'pending')
      return false;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        review.productName.toLowerCase().includes(searchLower) ||
        review.customerName.toLowerCase().includes(searchLower) ||
        review.comment.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Link
              to="/artisan-dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Product Reviews
          </h1>
          <p className="text-sm text-gray-600">
            Manage and respond to your product reviews
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedFilter === filter.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex"
            >
              {/* Product Image */}
              <img
                src={review.productImage }
                alt={review.productName}
                className="w-16 h-16 rounded object-cover"
              />
              {/* Review Content */}
              <div className="ml-3 flex-1">
                {/* Reviewer Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={review.reviewerPhoto || "./default.png"}
                      alt={review.customerName}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {review.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {review.productName}
                      </p>
                    </div>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center ml-2">
                    {Array(review.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                  </div>
                </div>
                {/* Comment */}
                <p className="text-sm text-gray-700 mt-1">
                  {review.comment}
                </p>
                {/* Meta Info */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{review.date}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        review.status.toLowerCase() === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700">
                    {review.status.toLowerCase() === 'pending'
                      ? 'Reply'
                      : 'View'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredReviews.length === 0 && (
            <div className="text-center text-gray-600 py-4">
              No reviews match your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;

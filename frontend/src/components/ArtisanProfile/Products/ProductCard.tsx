import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Rating,
  IconButton,
  Avatar,
  Tooltip
} from '@mui/material';
import { Heart, ShoppingCart, MapPin } from 'lucide-react';
import { Product } from '../../../types';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onFavoriteToggle: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({user , product, isFavorite, onFavoriteToggle, onAddToCart }) => {
  const navigate = useNavigate();

  const mainImage =
    product.images && product.images.length > 0 ? product.images[0] : '/default.png';

  // Assuming product.user contains artisan details.
  const userName = user.name || 'Unknown Artisan';
  const userAddress = user.adresse || 'No address provided';
  const userProfilePic = user.profilePicture || '/default.png';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        },
      }}
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="260"
          image={mainImage}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'scale(1.05)' },
            aspectRatio: '1/1',
          }}
        />
        <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(product._id);
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': { backgroundColor: 'white', transform: 'scale(1.1)' },
            }}
          >
            <Heart
              size={20}
              fill={isFavorite ? '#ff4081' : 'none'}
              color={isFavorite ? '#ff4081' : '#666'}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            cursor: 'pointer',
            '&:hover .artisan-name': { color: 'primary.main' },
          }}
          onClick={() => {
            if (userData._id) navigate(`/artisans/${userData._id}`);
          }}
        >
          <Avatar
            src={userProfilePic}
            alt={userName}
            sx={{ width: 40, height: 40, mr: 1 }}
          />
          <Box>
            <Typography
              variant="subtitle2"
              className="artisan-name"
              sx={{ transition: 'color 0.2s ease-in-out' }}
            >
              {userName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <MapPin size={14} color="#666" />
              <Typography variant="caption" color="text.secondary">
                {userAddress}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ ml: 'auto', textAlign: 'right' }}>
            <Rating value={product.rating || 3} size="small" readOnly />
            <Typography variant="caption" color="text.secondary" display="block">
              {product.reviews || 0} reviews
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
          onClick={() => navigate(`/products/${product._id}`)}
        >
          {product.name}
        </Typography>
        {product.tags && product.tags.length > 0 && (
          <Box sx={{ mb: 1 }}>
            {product.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
            ))}
          </Box>
        )}
        <Typography variant="body2" color="text.secondary" paragraph noWrap>
          {product.description}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product._id);
            }}
            sx={{
              backgroundColor: '#FFD54F',
              color: 'white',
              '&:hover': { backgroundColor: '#FFC107' },
            }}
          >
            <ShoppingCart size={20} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

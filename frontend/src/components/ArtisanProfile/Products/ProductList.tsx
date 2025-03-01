import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Product } from '../../../types';

interface FavoritesMap {
  [key: string]: {
    isFavorite: boolean;
    favoriteId?: string;
  };
}

interface ProductListProps {
  user?: {
    _id: string;
  };
  token?: string;
}

const ProductList: React.FC<ProductListProps> = ({ user, token }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<FavoritesMap>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    if (!user || !user._id) {
      console.error('User is not defined or does not have an _id');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `https://rarely.onrender.com/api/products/user/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user || !user._id) {
      console.error('User is not defined or does not have an _id');
      return;
    }
    try {
      const response = await axios.get(
        `https://rarely.onrender.com/api/favorites/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const favoritesMap: FavoritesMap = {};
      response.data.forEach((fav: any) => {
        favoritesMap[fav.product._id] = {
          isFavorite: true,
          favoriteId: fav._id,
        };
      });
      setFavorites(favoritesMap);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchProducts();
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Fixed handleAddToCart: use product._id instead of product.id and pass it to ProductCard.
  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast.error("You must be logged in to add products to your cart.");
      return;
    }
    // Use _id to locate the product.
    const product = products.find((p) => p._id === productId);
    if (!product) {
      toast.error("Product not found.");
      return;
    }
    const payload = {
      customerId: user._id,
      products: [{ productId, quantity: 1 }],
      totalAmount: product.price,
    };

    try {
      await axios.post("https://rarely.onrender.com/api/cart", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding to cart. Please try again.");
    }
  };

  // Fixed handleFavoriteToggle remains the same.
  const handleFavoriteToggle = async (productId: string) => {
    if (!user) {
      console.error('User must be logged in to favorite products.');
      return;
    }
    const isCurrentlyFav = !!favorites[productId]?.isFavorite;
    if (isCurrentlyFav) {
      try {
        const favoriteId = favorites[productId].favoriteId;
        await axios.delete(
          `https://rarely.onrender.com/api/favorites/${favoriteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites((prev) => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    } else {
      try {
        const response = await axios.post(
          `https://rarely.onrender.com/api/favorites`,
          { product: productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites((prev) => ({
          ...prev,
          [productId]: { isFavorite: true, favoriteId: response.data._id },
        }));
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    }
  };

  if (loading) {
    return (
      <Typography variant="body1" sx={{ py: 4, textAlign: 'center' }}>
        Loading products...
      </Typography>
    );
  }

  if (products.length === 0) {
    return (
      <Typography variant="body1" sx={{ py: 4, textAlign: 'center' }}>
        No products available at the moment.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          <ProductCard
            product={product}
            isFavorite={!!favorites[product._id]?.isFavorite}
            onFavoriteToggle={handleFavoriteToggle}
            onAddToCart={handleAddToCart}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;

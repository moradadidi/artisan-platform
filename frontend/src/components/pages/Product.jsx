import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Rating,
  Drawer,
  Checkbox,
  Slider,
  FormGroup,
  FormControlLabel,
  Divider,
  Button,
  Breadcrumbs,
  Link as MUILink,
  Chip,
  Paper,
  InputBase,
  Avatar,
  Tooltip,
  CircularProgress,
  Grow,
} from "@mui/material";
import {
  Heart,
  ShoppingCart,
  Filter,
  Search,
  Star,
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const categories = [
  "All Categories",
  "Ceramics",
  "Textiles",
  "Woodwork",
  "Jewelry",
  "Home Decor",
  "Kitchen",
  "Art",
];

const Products = () => {
  // Set the document title.
  useEffect(() => {
    document.title = "Shop - Rarely";
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  // Search state (synchronized with URL)
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");
    if (query) {
      setSearchQuery(decodeURIComponent(query));
    } else {
      setSearchQuery("");
    }
  }, [location.search]);

  // When user submits a search, update URL.
  const handleSearchSubmit = () => {
    const trimmed = searchQuery.trim();
    navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
  };

  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState([
    "All Categories",
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true); // For showing a loading state

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  // Toggle favorite for a product.
  const handleFavoriteToggle = async (productId) => {
    if (!user) {
      toast.error("You must be logged in to favorite products.");
      return;
    }
    const product = products.find((p) => p.id === productId);
    try {
      if (!product.isFavorite) {
        const response = await axios.post(
          "https://rarely.onrender.com/api/favorites",
          { product: productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Added to favorites");
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, isFavorite: true, favoriteId: response.data._id }
              : p
          )
        );
      } else {
        await axios.delete(
          `https://rarely.onrender.com/api/favorites/${product.favoriteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Removed from favorites");
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, isFavorite: false, favoriteId: null }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Error updating favorites. Please try again.");
    }
  };

  // Add product to cart.
  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error("You must be logged in to add products to your cart.");
      return;
    }
    const product = products.find((p) => p.id === productId);
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

  // Update price range.
  const handlePriceChange = (event, newValue) => setPriceRange(newValue);

  // Update categories selection.
  const handleCategoryChange = (category) => {
    if (category === "All Categories") {
      setSelectedCategories(["All Categories"]);
    } else {
      let newCategories = selectedCategories.filter(
        (c) => c !== "All Categories"
      );
      if (newCategories.includes(category)) {
        newCategories = newCategories.filter((c) => c !== category);
      } else {
        newCategories = [...newCategories, category];
      }
      if (newCategories.length === 0) {
        newCategories = ["All Categories"];
      }
      setSelectedCategories(newCategories);
    }
  };

  // Fetch products and merge with the user's favorites.
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery.trim()) {
        queryParams.append("search", searchQuery.trim());
      }
      queryParams.append("minPrice", priceRange[0]);
      queryParams.append("maxPrice", priceRange[1]);
      if (!selectedCategories.includes("All Categories")) {
        queryParams.append("categories", selectedCategories.join(","));
      }
      const response = await axios.get(
        `https://rarely.onrender.com/api/products?${queryParams.toString()}`
      );
      const data = response.data;
      const formattedProducts = data.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price || 0,
        rating: product.rating || 0,
        reviews: product.numReviews || 0,
        image: product.images[0] || "",
        artisan: {
          id: product.user._id || "0",
          name: product.user.name || "Unknown",
          avatar: product.user.profilePicture || "",
          location: product.user.adresse || "Canada, Ontario",
          rating: product.artisanRating || 3,
          reviews: product.artisanReviews || 125,
        },
        category: product.category || "Uncategorized",
        tags: product.tags || [],
        inStock: product.countInStock > 0,
        isFavorite: false,
        favoriteId: null,
      }));

      if (user && token) {
        const favResponse = await axios.get(
          `https://rarely.onrender.com/api/favorites/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const favoritesData = favResponse.data;
        const favoritesMap = {};
        favoritesData.forEach((fav) => {
          favoritesMap[fav.product._id] = fav._id;
        });
        formattedProducts.forEach((prod) => {
          if (favoritesMap[prod.id]) {
            prod.isFavorite = true;
            prod.favoriteId = favoritesMap[prod.id];
          }
        });
      }

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the API call when filters change.
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, priceRange, selectedCategories]);

  // Assume API returns correctly filtered products.
  const filteredProducts = products;

  // Filtering UI (Sidebar/Drawer) without search input.
  const FilterContent = () => (
    <Box sx={{ p: 3 }}>
      {/* Categories */}
      <Typography variant="subtitle1" gutterBottom>
        Categories
      </Typography>
      <FormGroup>
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
            }
            label={category}
          />
        ))}
      </FormGroup>
      <Divider sx={{ my: 3 }} />
      {/* Price Range */}
      <Typography variant="subtitle1" gutterBottom>
        Price Range
      </Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={3000}
        sx={{ mt: 2 }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="body2">${priceRange[0]}</Typography>
        <Typography variant="body2">${priceRange[1]}</Typography>
      </Box>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 , backgroundColor: "#FFD700", color: "black" }}
        onClick={() => setDrawerOpen(false)} // Closes drawer on mobile
      >
        Apply Filters
      </Button>
    </Box>
  );

  // Product Card Component.
  const ProductCardComponent = ({ product, index }) => (
    <Grow in timeout={300 + index * 50}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s ease-in-out",
          height: "100%",
          width: "100%",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardActionArea onClick={() => navigate(`/products/${product.id}`)}>
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="260"
              image={product.image}
              alt={product.name}
              sx={{
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.03)" },
                aspectRatio: "1/1",
              }}
            />
            <Tooltip
              title={
                product.isFavorite
                  ? "Remove from Favorites"
                  : "Add to Favorites"
              }
            >
              <IconButton
                onClick={(e) => {
                  e.stopPropagation(); // Prevent CardActionArea click
                  handleFavoriteToggle(product.id);
                }}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "white",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Heart
                  size={20}
                  fill={product.isFavorite ? "#ff4081" : "none"}
                  color={product.isFavorite ? "#ff4081" : "#666"}
                />
              </IconButton>
            </Tooltip>
            {!product.inStock && (
              <Chip
                label="Out of Stock"
                color="error"
                size="small"
                sx={{ position: "absolute", left: 8, top: 8 }}
              />
            )}
          </Box>
          <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            {/* Artisan Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/artisans/${product.artisan.id}`);
              }}
            >
              <Avatar
                src={product.artisan.avatar}
                alt={product.artisan.name}
                sx={{ width: 40, height: 40, mr: 1, cursor: "pointer" }}
              />
              <Box sx={{ cursor: "pointer" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    transition: "color 0.2s ease-in-out",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {product.artisan.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <MapPin size={14} color="#666" />
                  <Typography variant="caption" color="text.secondary">
                    {product.artisan.location}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ ml: "auto", textAlign: "right" }}>
                <Rating value={product.artisan.rating} size="small" readOnly />
                <Typography variant="caption" color="text.secondary" display="block">
                  {product.artisan.reviews} reviews
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                "&:hover": { color: "primary.main" },
              }}
            >
              {product.name}
            </Typography>
            <Box sx={{ mb: 1, display: "flex", flexWrap: "wrap" }}>
              {product.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
              ))}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Rating
                value={product.rating}
                precision={0.5}
                size="small"
                readOnly
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviews})
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: "auto",
              }}
            >
              <Typography variant="h6" color="primary">
                ${product.price}
              </Typography>
              <Tooltip title={product.inStock ? "Add to Cart" : "Out of Stock"}>
                <span>
                  <IconButton
                    color="primary"
                    disabled={!product.inStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                    sx={{
                      backgroundColor: product.inStock ? "#fdd835" : "grey.200",
                      color: "white",
                      "&:hover": {
                        backgroundColor: product.inStock ? "#f9a825" : "grey.200",
                      },
                    }}
                  >
                    <ShoppingCart size={20} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grow>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { sm: "none" } }}
      >
        <Box sx={{ width: 280 }}>
          <FilterContent />
        </Box>
      </Drawer>
      {/* Desktop Filters Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 280,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
          borderRight: "1px solid #eee",
          height: "calc(100vh - 64px)",
          position: "sticky",
          top: 64,
          overflowY: "auto",
        }}
      >
        <FilterContent />
      </Paper>
      {/* Main Products Grid */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Container maxWidth="xl">
          {/* Top Search Bar (outside of FilterContent) */}
          

          {/* Header & Breadcrumbs */}
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
              <MUILink underline="hover" color="inherit" href="/">
                Home
              </MUILink>
              <Typography color="text.primary">Shop</Typography>
            </Breadcrumbs>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" gutterBottom>
                All Products
              </Typography>
              {/* <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" startIcon={<Star />}>
                  Popular
                </Button>
                <Button variant="outlined" startIcon={<ArrowUpRight />}>
                  Latest
                </Button>
              </Box> */}
              <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              p: 1,
            }}
          >
            <Search size={20} color="#666" />
            <InputBase
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit();
              }}
              sx={{ ml: 1, flex: 1 }}
            />
            <Button  onClick={handleSearchSubmit}>
              <Search size={20} />
            </Button>
          </Box>
            </Box>
          </Box>

          {/* Mobile Filter Button */}
          <Box sx={{ display: { sm: "none" }, mb: 2 }}>
            <Button
              startIcon={<Filter />}
              variant="outlined"
              onClick={() => setDrawerOpen(true)}
              fullWidth
            >
              Filters
            </Button>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Products Grid */}
          {!loading && (
            <>
              {filteredProducts.length === 0 ? (
                <Box sx={{ textAlign: "center", mt: 5 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No products found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters or search to find what you’re looking for.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={4}>
                  {filteredProducts.map((product, index) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={product.id}>
                      <ProductCardComponent product={product} index={index} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Products;

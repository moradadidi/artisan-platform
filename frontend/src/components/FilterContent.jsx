import { Box, Typography, InputBase, FormGroup, FormControlLabel, Checkbox, Divider, Slider, Button } from '@mui/material';
import { Search } from 'lucide-react';

const FilterContent = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategories,
  handleCategoryChange,
  priceRange,
  handlePriceChange,
  onApplyFilters,
}) => {
  return (
    <Box>
      {/* Search */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          p: 1,
          mb: 3,
        }}
      >
        <Search size={20} color="#666" />
        <InputBase
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
        />
      </Box>

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
        max={200}
        sx={{ mt: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="body2">${priceRange[0]}</Typography>
        <Typography variant="body2">${priceRange[1]}</Typography>
      </Box>

      <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={onApplyFilters}>
        Apply Filters
      </Button>
    </Box>
  );
};

export default FilterContent;

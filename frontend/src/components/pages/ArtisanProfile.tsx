import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Card,
  Tabs,
  Tab,
  Divider,
  Typography,
  CircularProgress
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Removed CoverImage import as we no longer display a cover image
// Components
import ArtisanInfo from '../ArtisanProfile/ArtisanInfo';
import ArtisanStats from '../ArtisanProfile/ArtisanStats';
import ProductList from '../ArtisanProfile/Products/ProductList';
import ReviewsTab from '../ArtisanProfile/Reviews/ReviewsTab';
import AboutTab from '../ArtisanProfile/About/AboutTab';

// Types
import { ArtisanData } from '../../types/index';

const ArtisanProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artisanData, setArtisanData] = useState<ArtisanData | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handler for tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Fetch artisan data using Axios
  useEffect(() => {
    const fetchArtisanData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`https://rarely.onrender.com/api/users/${id}`);
        setArtisanData(response.data);
      } catch (err) {
        console.error('Error fetching artisan data:', err);
        setError('Failed to load artisan profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtisanData();
  }, [id]);

  if (loading) {
    return (
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 8, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexDirection: 'column', 
          gap: 2 
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6">
          Loading artisan profile...
        </Typography>
      </Container>
    );
  }

  if (error || !artisanData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Typography variant="h5" align="center" color="error">
          {error || 'Artisan not found.'}
        </Typography>
      </Container>
    );
  }

  // Retrieve token from localStorage (ensure it's set when the user logs in)
  const token = localStorage.getItem('token') || '';

  return (
    <Box>
      {/* Toast notifications container */}
      <ToastContainer position="bottom-center" />
      
      {/* Only Profile Image will be used inside ArtisanInfo; cover image is removed */}
      <Container maxWidth="lg" sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card 
              sx={{ 
                p: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2
              }}
            >
              {/* Artisan Info Section */}
              <ArtisanInfo artisanData={artisanData} />

              <Divider sx={{ my: 3 }} />

              {/* Stats Section */}
              <ArtisanStats stats={artisanData.stats} />
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box 
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider', 
                mb: 3,
                '& .MuiTab-root': {
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)'
                  }
                }
              }}
            >
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ 
                  '& .Mui-selected': {
                    fontWeight: 'bold'
                  }
                }}
              >
                <Tab label="Products" />
                <Tab label="Reviews" />
                <Tab label="About" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ py: 2 }}>
              {activeTab === 0 && (
                // Pass the artisanData (user) and token to ProductList so it can fetch products via axios
                <ProductList user={artisanData} token={token} />
              )}

              {activeTab === 1 && (
                <ReviewsTab artisanId={artisanData.id} />
              )}

              {activeTab === 2 && (
                <AboutTab artisanData={artisanData} />
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ArtisanProfile;

import { Container, Grid, Typography, Box, Button } from '@mui/material';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h2" gutterBottom>
              About RARELY
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Connecting artisans with art lovers worldwide
            </Typography>
            <Typography variant="body1" paragraph>
              RARELY is a curated marketplace that brings together exceptional artisans and discerning collectors. We believe in the power of handcrafted pieces to tell stories and create meaningful connections.
            </Typography>
            <Typography variant="body1" paragraph>
              Our platform supports independent artisans by providing them with the tools and visibility they need to share their craft with the world. Every piece in our collection is carefully selected for its quality, authenticity, and artistic value.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowRight />}
              sx={{ mt: 2 }}
            >
              Meet Our Artisans
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600"
            alt="Artisan at work"
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ my: 6, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
              Our Values
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Craftsmanship
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We celebrate the dedication and skill that goes into every handcrafted piece.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Sustainability
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We promote sustainable practices and materials in artisanal creation.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Community
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We build meaningful connections between artisans and art enthusiasts.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About;
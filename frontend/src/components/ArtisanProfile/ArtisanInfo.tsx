import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Chip, 
  Button, 
  IconButton 
} from '@mui/material';
import { MapPin, Star, Instagram, Twitter, Globe } from 'lucide-react';
import { ArtisanData } from '../../types/index';

interface ArtisanInfoProps {
  artisanData: ArtisanData;
}

const ArtisanInfo: React.FC<ArtisanInfoProps> = ({ artisanData }) => {
  const [following, setFollowing] = useState(false);

  const handleFollowToggle = () => {
    setFollowing(!following);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, gap: 3 }}>
      <Avatar
        src={artisanData.profilePicture || './default.png'}
        sx={{ 
          width: { xs: 120, md: 160 }, 
          height: { xs: 120, md: 160 },
          border: '4px solid white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4">
            {artisanData.name}
          </Typography>
          <Chip 
            label={artisanData.specialty || 'Artisanal Crafts'}
            color="primary"
            sx={{ fontWeight: 500 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
          <MapPin size={18} />
          <Typography variant="body1" sx={{ ml: 1 }}>
            {artisanData.address}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 3 }}>
            <Star size={18} fill="#FFD700" stroke="#FFD700" />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {artisanData.rating} ({artisanData.reviews} reviews)
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary" paragraph>
          {artisanData.bio}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={following ? "outlined" : "contained"}
            onClick={handleFollowToggle}
            sx={{
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
          >
            {following ? 'Following' : 'Follow'}
          </Button>
          {artisanData.socialLinks?.instagram && (
            <IconButton 
              component="a" 
              href={artisanData.socialLinks.instagram} 
              target="_blank"
              sx={{ 
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  color: '#E1306C',
                  transform: 'translateY(-2px)'
                } 
              }}
            >
              <Instagram />
            </IconButton>
          )}
          {artisanData.socialLinks?.twitter && (
            <IconButton 
              component="a" 
              href={artisanData.socialLinks.twitter} 
              target="_blank"
              sx={{ 
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  color: '#1DA1F2',
                  transform: 'translateY(-2px)'
                } 
              }}
            >
              <Twitter />
            </IconButton>
          )}
          {artisanData.socialLinks?.website && (
            <IconButton 
              component="a" 
              href={artisanData.socialLinks.website} 
              target="_blank"
              sx={{ 
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  color: '#4285F4',
                  transform: 'translateY(-2px)'
                } 
              }}
            >
              <Globe />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ArtisanInfo;
import React from 'react';
import { Box, Typography, Avatar, Chip, IconButton, Divider } from '@mui/material';
import { MapPin, Star, Instagram, Twitter, Globe } from 'lucide-react';
import { ArtisanData } from '../../types/index';

interface ArtisanInfoProps {
  artisanData: ArtisanData;
}

const ArtisanInfo: React.FC<ArtisanInfoProps> = ({ artisanData }) => {
  return (
    <Box
      sx={{
        p: 3,
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: 1,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'center' },
        gap: 3,
      }}
    >
      <Avatar
        alt={artisanData.name || 'Artisan'}
        src={artisanData.profilePicture ??'./default.png'}
        sx={{
          width: { xs: 120, md: 160 },
          height: { xs: 120, md: 160 },
          border: '4px solid #fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {artisanData.name || 'Artisan Name'}
          </Typography>
          {artisanData.specialty && (
            <Chip
              label={artisanData.specialty}
              color="primary"
              sx={{ fontWeight: 500 }}
            />
          )}
        </Box>

        {/* Address */}
        {artisanData.address && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <MapPin size={18} color="#555" />
            <Typography variant="body1" sx={{ ml: 1, color: '#555' }}>
              {artisanData.address}
            </Typography>
          </Box>
        )}

        {/* Rating */}
        {(artisanData.rating || artisanData.rating === 0) && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Star size={18} fill="#FFD700" stroke="#FFD700" />
            <Typography variant="body1" sx={{ ml: 1, color: '#555' }}>
              {artisanData.rating} ({artisanData.reviews || 0} reviews)
            </Typography>
          </Box>
        )}

        {/* Bio */}
        <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
          {artisanData.bio || 'This artisan has not provided a bio yet.'}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Social Links */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {artisanData.socialLinks?.instagram && (
            <IconButton
              component="a"
              href={artisanData.socialLinks.instagram}
              target="_blank"
              aria-label="Instagram"
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: '#E1306C',
                  transform: 'translateY(-2px)',
                },
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
              aria-label="Twitter"
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: '#1DA1F2',
                  transform: 'translateY(-2px)',
                },
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
              aria-label="Website"
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: '#4285F4',
                  transform: 'translateY(-2px)',
                },
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

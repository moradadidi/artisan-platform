import React from 'react';
import { Box } from '@mui/material';

interface CoverImageProps {
  imageUrl: string;
}

const CoverImage: React.FC<CoverImageProps> = ({ imageUrl }) => {
  return (
    <Box
      sx={{
        height: { xs: 200, md: 300 },
        position: 'relative',
        backgroundImage: `url("${imageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
        }
      }}
    />
  );
};

export default CoverImage;
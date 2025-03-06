export interface ArtisanData {
    id: string;
    name: string;
    profilePicture?: string;
    coverImage?: string;
    specialty?: string;
    address: string;
    rating: number;
    reviews: number;
    bio: string;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      website?: string;
    };
    stats?: {
      totalSales: number;
      completedOrders: number;
      averageRating: number;
    };
    products: Product[];
  }
  
  export interface Product {
    id: string;
    name: string;
    images: string[];
    price: number;
    rating: number;
    reviews: number;
    tags?: string[];
  }
  
  export interface Review {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    createdAt: string;
    customerId: {
      profilePicture: string;
      name: string;
    }
  }
  
  export interface ReviewFormData {
    rating: number;
    comment: string;
  }
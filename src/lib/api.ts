import { strapi } from '@strapi/client';

// Create a basic client for API requests that don't need authentication
const baseClient = strapi({ 
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:1337/api' 
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api'
});

export default baseClient;

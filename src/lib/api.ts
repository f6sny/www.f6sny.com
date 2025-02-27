import { strapi } from '@strapi/client';

const client = strapi({ baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:1337/api' : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api' }); 

export default client;

import client from './api';
import { strapi } from '@strapi/client';

// Track the current token
let currentToken: string | null = null;

// Function to get a configured client with the current token
const getClient = () => {
  return strapi({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api',
    auth: currentToken || undefined,
  });
};

export const auth = {
  login: async (data: { identifier: string; password: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const result = await response.json();
    // Update the token
    if (result.jwt) {
      currentToken = result.jwt;
    }
    
    return result;
  },
  
  register: async (data: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    const result = await response.json();
    // Update the token
    if (result.jwt) {
      currentToken = result.jwt;
    }
    
    return result;
  },
  
  forgotPassword: async (data: { email: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Forgot password request failed');
    }
    
    return response.json();
  },
  
  resetPassword: async (data: { code: string; password: string; passwordConfirmation: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Reset password failed');
    }
    
    const result = await response.json();
    // Update the token
    if (result.jwt) {
      currentToken = result.jwt;
    }
    
    return result;
  },
  
  setToken: (token: string) => {
    currentToken = token || null;
  },
  
  // Get a client with the current auth token
  getClient: () => {
    return getClient();
  }
};
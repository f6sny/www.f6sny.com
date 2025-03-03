import { Strapi } from '@strapi/client';

declare module '@strapi/client' {
  interface Strapi {
    auth?: {
      login: (data: { identifier: string; password: string }) => Promise<any>;
      register: (data: any) => Promise<any>;
      forgotPassword: (data: { email: string }) => Promise<any>;
      resetPassword: (data: { code: string; password: string; passwordConfirmation: string }) => Promise<any>;
    };
    setToken?: (token: string) => void;
    requestConfig?: {
      headers?: Record<string, string>;
    };
  }
} 
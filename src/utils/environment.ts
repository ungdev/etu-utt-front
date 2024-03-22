// This file parse and export all environment variables
export const nodeEnv = () => process.env.NODE_ENV;
export const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
export const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v0';
export const apiTimeout = Number(process.env.NEXT_PUBLIC_API_REQUEST_TIMEOUT || 0);

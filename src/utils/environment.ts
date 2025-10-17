// This file parse and export all environment variables
export const nodeEnv = () => process.env.NODE_ENV;
export const isDevEnv = () => process.env.NODE_ENV === 'development';
export const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
export const apiVersion = Number(process.env.NEXT_PUBLIC_API_VERSION || 0);
export const apiTimeout = Number(process.env.NEXT_PUBLIC_API_REQUEST_TIMEOUT || 0);
export const isServerSide = () => typeof window === 'undefined';
export const isClientSide = () => typeof window !== 'undefined';
export const etuuttWebApplicationId = process.env.NEXT_PUBLIC_ETUUTT_WEB_APPLICATION_ID as string;

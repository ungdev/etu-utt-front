// This file parse and export all environment variables
export const nodeEnv = () => process.env.NODE_ENV;
export const apiUrl = () => process.env.NEXT_PUBLIC_API_URL || '';
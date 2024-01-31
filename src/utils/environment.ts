// This file parse and export all environment variables
export const nodeEnv = () => process.env.NODE_ENV;
export const isServerSide = () => typeof window === 'undefined';
export const isClientSide = () => typeof window !== 'undefined';

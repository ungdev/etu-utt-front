// This file parse and export all environment variables
export const nodeEnv = () => process.env.NODE_ENV;
export const isDevEnv = () => process.env.NODE_ENV === 'development';
export const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
export const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v0';
export const apiTimeout = Number(process.env.NEXT_PUBLIC_API_REQUEST_TIMEOUT || 0);
export const isServerSide = () => typeof window === 'undefined';
export const isClientSide = () => typeof window !== 'undefined';
export const authorizationTokenExpiresIn = () => Number(process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN_EXPIRES_IN || 0);
export const etuuttWebApplicationId = process.env.NEXT_PUBLIC_ETUUTT_WEB_APPLICATION_ID as string;

export function getCasServiceUrl(applicationId?: string) {
  const serviceUrl = process.env.NEXT_PUBLIC_CAS_SERVICE_URL;
  if (!serviceUrl) {
    return '';
  }

  const url = new URL(serviceUrl);
  if (applicationId && applicationId !== etuuttWebApplicationId) {
    url.searchParams.set('application', applicationId);
  }

  return url.toString();
}

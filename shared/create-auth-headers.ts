import { useCookie } from '#imports';

export const createAuthHeaders = (): Record<string, string> => {
  const authToken = useCookie('authToken').value;
  if (!authToken) throw new Error('No auth token found');

  return {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };
};
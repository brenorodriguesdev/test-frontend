import { jwtDecode } from 'jwt-decode';

export function isAuthenticated(): boolean {
  const authToken = useCookie('authToken').value;
  if (!authToken) {
    return false;
  }

  try {
    const decodedToken: { exp?: number } = jwtDecode(authToken);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      useCookie('authToken').value = null; 
      return false;
    }
    return true;
  } catch (error) {
    useCookie('authToken').value = null;
    return false;
  }
}
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const getUserId = (): string | null => {
  return localStorage.getItem('userId');
};

export const getUserName = (): string | null => {
  return localStorage.getItem('userName');
};

export const getUserRoles = (): string[] => {
  const roles = localStorage.getItem('userRoles');
  return roles ? JSON.parse(roles) : [];
};

export const clearAuthData = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRoles');
};

export const isAuthenticated = (): boolean => {
  return !!(getAuthToken() && getUserId());
};

const API_BASE_URL = 'http://localhost:8080';

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : '', 
      },
    });
    return response.ok;
  } catch {
    return false;1
  }
};
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Signup failed');
  }
  
  return response.json();
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  
  return response.json();
};
export const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : '',
      ...options.headers,
    },
  });

  if (response.status === 403 || response.status === 401) {
    // Token is invalid or expired
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
};
export const sendChatMessage = async (message: string, history: Array<{role: string, content: string}> = []) => {
  return makeAuthenticatedRequest('/chat/message', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  });
};
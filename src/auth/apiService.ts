import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_API_URL}/api`,
});

// Function to get a new access token using refresh token
export const getNewToken = async (refreshToken: string | null): Promise<string | null> => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/login/refresh`, {
      refresh: refreshToken,
    });
    return response.data.access;
  } catch (error) {
    console.error('Error getting new token:', error);
    return null;
  }
};

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    // Bypass the interceptor for login and register requests
    if (config.url?.endsWith('/login') || config.url?.endsWith('/register')) {
      return config;
    }

    const token = localStorage.getItem('access'); // get your token from local storage
    const refreshToken = localStorage.getItem('refresh'); // get your refresh token from local storage

    // If there's no token, or it is expired, try to get a new one
    if (!token || tokenExpired(token)) {
      if (refreshToken) {
        const newToken = await getNewToken(refreshToken);
        if (newToken) {
          config.headers['Authorization'] = 'Bearer ' + newToken;
          localStorage.setItem('access', newToken);
        } else {
          // If getting a new token fails, log the user out
          logoutUser();
        }
      } else {
        // If there's no refresh token, log the user out
        logoutUser();
      }
    } else {
      config.headers['Authorization'] = 'Bearer ' + token; // set JWT token to Authorization header
    }

    return config;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.log('Network error');
    }

    return Promise.reject(error);
  }
);

// Function to check if the token is expired
export const tokenExpired = (token: string | null): boolean => {
  if (token == null) {
    return true;
  }

  // JWT token is base64 encoded string with structure: header.payload.signature
  // Payload is a JSON string with token data (including exp field)
  const payload = JSON.parse(atob(token.split('.')[1]));

  // Check if token is expired
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};

// Function to log out the user
const logoutUser = (): void => {
  console.log("logoutUser: ")
  // Remove tokens and user data from local storage
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  // Redirect user to login page
  window.location.href = '/login';
};

export default api;

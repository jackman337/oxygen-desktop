import api from './apiService';
import { store } from "../store";
import { loadUser, logout } from "../redux/userSlice"; // import the logout action as well

export async function loadUserFromLocalStorage() {
  const token = localStorage.getItem('access'); // get your token from local storage
  if (token) {
    // validate token with your backend server
    try {
      const response = await api.post('/login/validate_token/', {
        token: token,
      });
      if (response.status === 200) {
        const { id, username, email } = response.data.user; // extract only the necessary properties
        // dispatch action to update user state
        store.dispatch(loadUser({ id, username, email })); // pass the extracted properties
      } else {
        // dispatch action to set user state to null
        store.dispatch(logout()); // use the logout action creator
      }
    } catch (error) {
      console.error('Failed to validate token: ', error);
      // handle error, remove invalid token, etc.
    }
  }
}

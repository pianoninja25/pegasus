import { jwtDecode } from 'jwt-decode';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';

// Function to check if the token is expired
function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
}

// Function to refresh the access token using refresh token
async function refreshAccessToken(session) {
  if (session?.refresh_token) {
    try {
      const accessToken = session.access_token;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PEGASUS_API}/refresh`,
        { refresh_token: session.refresh_token },
        { headers: { Authorization: `Bearer ${accessToken}` }}
      );

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;
        session.access_token = access_token;
        session.refresh_token = refresh_token;

      } else {
        console.error('Failed to refresh token');
        signOut(); 
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      signOut();
    }
  }
}

export { isTokenExpired, refreshAccessToken };

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
  console.log('tokem')
  // Ensure session and refresh_token exist
  if (session?.refresh_token) {
    try {
      // Get the current access token from the session
      const accessToken = session.token;

      // Make the POST request using axios with Bearer token authentication
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PEGASUS_API}/refresh`,
        {
          refresh_token: session.refresh_token,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(response)

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;
        console.log('new tokens:', access_token, refresh_token);

        // Update session with new tokens
        session.token = access_token;
        session.refresh_token = refresh_token;

      } else {
        console.error('Failed to refresh token');
        // signOut(); // Uncomment to log out if the refresh fails
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      // signOut(); // Uncomment to log out if an error occurs
    }
  }
}

export { isTokenExpired, refreshAccessToken };

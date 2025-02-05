import axios from 'axios';


const API_URL = process.env.PEGASUS_API; 


async function getPegasusToken(username, password) {
  try {
    const response = await axios.post(`${API_URL}/token`, {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status !== 200) {
      throw new Error('Failed to retrieve token');
    }

    return response.data.access_token;
  } catch (error) {
    console.error('Error while fetching the token:', error);
    throw new Error(error.response ? error.response.data.message : 'An unexpected error occurred');
  }
}



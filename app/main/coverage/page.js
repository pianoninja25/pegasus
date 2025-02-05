import axios from 'axios';
import { getServerSession } from "next-auth/next";
import options from '../../api/auth/[...nextauth]/options';
import MapContainer from './mapContainer';

// Server Component
async function fetchPolygons(tenant) {
  try {
    const URL = process.env.NEXTAUTH_URL
    const response = await axios.get(`${URL}/api/test_geo?query=test_geo&tenant=${tenant}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching polygons:', error);
    return [];
  }
}


export default async function Googles() {
  const session = await getServerSession(options);
  const polygons = await fetchPolygons(session.user.tenant);

  return (
    <MapContainer polygons={polygons} />
  );
}

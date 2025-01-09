

// export const fetchSiteList = async (clientName) => {
//   const res = await fetch(`/api/site_list?user=${clientName}`);
//   if (!res.ok) {
//     throw new Error('Failed to fetch site list');
//   }
//   const data = await res.json();
//   return data; // Ensure this returns the expected format for markers
// };

export async function fetchSampleFAT(client) {
  const res = await fetch(`/api/coverage?query=sample_client_sitelist&client=${client}`);
  if (!res.ok) {
    throw new Error('Failed to fetch coverage data');
  }
  return await res.json();
}


export const fetchSiteList = async (clientName) => {
  const res = await fetch(`/api/site_list?user=${clientName}`);
  if (!res.ok) {
    throw new Error('Failed to fetch site list');
  }
  const data = await res.json();
  return data; // Ensure this returns the expected format for markers
};

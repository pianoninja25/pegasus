import axios from 'axios';

export const fetchApi = async (endpoint) => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
};

// GET VIEW
export const fetchUserManagement = async (user, setDatas, setLoading) => {
  try {
    setLoading(true);
    if (user?.username) {
      const fetchedTenants = user?.role === 'superadmin'
        ? await fetchApi('/api/users/view?type=tenants')
        : [];
      const fetchedUsers = await fetchApi('/api/users/view?type=users');
      
      setDatas({
        tenants: fetchedTenants,
        users: fetchedUsers,
      });
    }
  } catch (error) {
    console.error('Failed to fetch:', error);
  } finally {
    setLoading(false);
  }
};


// POST CREATE TENANT
export const createTenant = async (values) => {
  const { username, name, email, pass_id, auth_id, radius_meter, prefix } = values;
  try {
    const response = await axios.post("/api/users/create", {
      "type": 'tenants',
      "username": username,
      "name": name,
      "email": email,
      "pass_id": pass_id,
      "auth_id": auth_id,
      "radius_meter": radius_meter,
      "prefix": prefix.toUpperCase()
    });
    return response
  } catch (error) {
    console.log(error)
    const errorMessage = error?.response?.data?.error || "An unknown error occurred.";
    return errorMessage
  }
};


// PUT UPDATE TENANT
export const updateTenant = async (values) => {
  const { username, name, email, pass_id, radius_meter, auth_id } = values;
  try {
    const response = await axios.patch("/api/users/update", {
      "type": 'tenants',
      "username": username,
      "name": name,
      "email": email,
      "pass_id": pass_id,
      "radius_meter": radius_meter,
      "auth_id": auth_id
    });
    return response
  } catch (error) {
    const errorMessage = error?.response?.data?.error || "An unknown error occurred.";
    return errorMessage
  }
};







// POST CREATE USER
export const createUser = async (values) => {
  const { username, name, password, tenant, role } = values;
  try {
    const response = await axios.post("/api/users/create", {
      "type": 'users',
      "username": `${tenant?.toLowerCase()}.${username}`,
      "name": name,
      "password": password,
      "tenant": tenant,
      "role": role
    });
    return response
  } catch (error) {
    const errorMessage = error?.response?.data?.error || "An unknown error occurred.";
    return errorMessage
  }
};


// PUT UPDATE USER
export const updateUser = async (values) => {
  const { username, name, password, tenant, role } = values;
  try {
    const response = await axios.patch("/api/users/update", {
      "type": 'users',
      "username": username,
      "name": name,
      "password": password,
      "tenant": tenant,
      "role": role,
    });
    return response
  } catch (error) {
    console.log(error)
    const errorMessage = error?.response?.data?.error || "An unknown error occurred.";
    return errorMessage
  }
};
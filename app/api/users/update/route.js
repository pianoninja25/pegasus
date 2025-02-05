import bcrypt from 'bcrypt';
import { getServerSession } from "next-auth/next";
import dbConnect from "@/utils/db-connection";
import options from "../../auth/[...nextauth]/options";

const saltRounds = 12;


export async function PATCH(req) {
  const body = await req.json(); // Get the JSON body of the request

  // Retrieve the session
  const session = await getServerSession(options);

  if (!session) {
    return new Response(JSON.stringify({ message: "You don't have the authorization!" }), { status: 401 });
  }

  // Check role-specific permissions
  if (session.user.role === 'superadmin') {
    if (body.type === 'tenants' || body.type === 'users') {
      return await editData(body.type, body, session.user); 
    }
  } else if (session.user.role === 'admin') {
    if (body.type === 'users') {
      return await editData(body.type, body, session.user); 
    } else {
      return new Response(
        JSON.stringify({ message: 'You are not authorized to perform this action' }),
        { status: 403 }
      );
    }
  } else if (session.user.role === 'user') {
    return new Response(
      JSON.stringify({ message: 'You are not authorized to perform this action' }),
      { status: 401 }
    );
  }

  // If the type is invalid, return a 404
  return new Response('404 | This page could not be found.', { status: 404 });
}


// Helper function to edit data
async function editData(ptype, data, sessionUser = null) {
  let conn;
  let query;
  let params;

  if (ptype === 'tenants') {
    // Validate that the new required fields are present in the payload
    if (!data.username || !data.name || !data.email || !data.pass_id || !data.auth_id || !data.radius_meter) {
      return new Response('Missing required fields for tenants', { status: 400 });
    }

    // Assuming we're updating the tenant details based on their 'auth_id'
    query = `UPDATE tenants 
             SET email = ?, name = ?, pass_id = ?, auth_id = ?, radius_meter = ?, create_date = NOW()
             WHERE username = ?`;
    params = [data.email, data.name, data.pass_id, data.auth_id, data.radius_meter, data.username];
  } else if (ptype === 'users') {
    // Ensure data contains necessary fields for the user update
    if (!data.username || !data.name || !data.role) {
      return new Response('Missing required fields for users', { status: 400 });
    }

    // Superadmins can edit any user; admins can edit users from their own tenant only
    if (sessionUser.role === 'admin' && sessionUser.tenant !== data.tenant) {
      console.log(sessionUser.role, sessionUser.tenant, data.tenant)
      return new Response(
        JSON.stringify({ message: 'You are not authorized to edit this user' }),
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    query = `UPDATE users SET name = ?, role = ?, password = ? WHERE username = ?`;
    params = [data.name, data.role, hashedPassword, data.username];
  } else {
    return new Response('Invalid type parameter', { status: 404 });
  }

  try {
    conn = await dbConnect('pegasus').getConnection();
    const result = await conn.query(query, params);

    if (result.affectedRows === 0) {
      return new Response('No rows affected. Ensure the ID or username is valid.', { status: 404 });
    }

    return new Response(JSON.stringify({ message: `${data.username} updated successfully!` }), { status: 200 });
  } catch (error) {
    console.error('Error updating data:', error);
    return new Response('Internal Server Error', { status: 500 });
  } finally {
    dbConnect('pegasus').releaseConnection(conn);
    conn.close();
  }
}



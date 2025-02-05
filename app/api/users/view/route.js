import { getServerSession } from "next-auth/next";

import dbConnect from "@/utils/db-connection"; 
import options from "../../auth/[...nextauth]/options";

export async function GET(req) {
  const ptype = req.nextUrl.searchParams.get("type");

  // Retrieve the session
  const session = await getServerSession(options);
  
  if (!session) {
    return new Response(JSON.stringify({ message: "You don't have the authorization!" }), { status: 401 });
  }

  // Check role-specific permissions
  if (session.user.role === 'superadmin') {
    if (ptype === 'tenants' || ptype === 'users') {
      return await fetchData(ptype, session.user); 
    }
  } else if (session.user.role === 'admin') {
    if (ptype === 'users') {
      return await fetchData(ptype, session.user); 
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

// Helper function to query the database
async function fetchData(ptype, sessionuser = null) {
  let conn;
  let query;


  if (ptype === 'tenants') {
    query = `SELECT * FROM tenants ORDER BY create_date DESC`;
  } else if (ptype === 'users' && sessionuser.role === 'superadmin') {
    query = `SELECT username, tenant, name, role, create_date FROM users ORDER BY create_date DESC`;
  } else if (ptype === 'users') {
    query = `SELECT username, tenant, name, role, create_date FROM users WHERE tenant = ? ORDER BY create_date DESC`;
  } else {
    return new Response('Invalid type parameter', { status: 404 });
  }

  try {
    conn = await dbConnect('pegasus').getConnection();
    const [rows] = await conn.query(query, sessionuser.tenant ? [sessionuser.tenant] : []);
    
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error querying database:', error);
    return new Response('Internal Server Error', { status: 500 });
  } finally {
    dbConnect('pegasus').releaseConnection(conn);
    conn.close();
  }
}

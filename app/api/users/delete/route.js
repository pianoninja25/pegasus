import { getServerSession } from "next-auth/next";
import dbConnect from "@/utils/db-connection"; 
import options from "../../auth/[...nextauth]/options";

export async function DELETE(req) {
  const ptype = req.nextUrl.searchParams.get("type");
  const username = req.nextUrl.searchParams.get("username"); // Assuming the entity to delete is specified by an `username` param

  // Retrieve the session
  const session = await getServerSession(options);
  
  if (!session) {
    return new Response(JSON.stringify({ message: "You don't have the authorization!" }), { status: 401 });
  }

  console.log(session.user.role, ptype)
  // Check role-specific permissions
  if (session.user.role === 'superadmin') {
    return await deleteData(ptype, username);
  } 
  else if (session.user.role === 'admin') {
    if (ptype === 'user') {
      return await deleteData(ptype, username, session.user.tenant);
    } else {
      return new Response(
        JSON.stringify({ message: 'You are not authorized to perform this action' }),
        { status: 403 }
      );
    }
  } 
  else {
    return new Response(
      JSON.stringify({ message: 'You are not authorized to perform this action' }),
      { status: 401 }
    );
  }
}

// Helper function to delete data
async function deleteData(ptype, id, tenantID = null) {
  let conn;
  let query;
  let params = [id];

  if (ptype === 'tenant') {
    query = `DELETE FROM tenants WHERE username = ?`;
  } else if (ptype === 'user') {
    query = `DELETE FROM users WHERE username = ?`;
    if (tenantID) {
      query += ` AND tenant = ?`;
      params.push(tenantID);
    }
  } else {
    return new Response('Invalid data type for deletion', { status: 400 });
  }

  try {
    conn = await dbConnect('pegasus').getConnection();
    const [result] = await conn.query(query, params);
    
    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: 'No data found to delete' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Data successfully deleted' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting data:', error);
    return new Response('Internal Server Error', { status: 500 });
  } finally {
    dbConnect('pegasus').releaseConnection();
    conn.close();
  }
}

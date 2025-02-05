import { getServerSession } from "next-auth/next";
import dbConnect from "@/utils/db-connection"; 
import options from "../../auth/[...nextauth]/options";

export async function POST(req) {
  try {
    const session = await getServerSession(options);

    // if (!session) {
    //   return new Response(JSON.stringify({ message: "You don't have the authorization!" }), { status: 401 });
    // }
    const { sitelist } = await req.json();

    if (!sitelist) {
      return new Response(JSON.stringify({ message: "Missing 'sitelist' parameter" }), { status: 400 });
    }

    // Call helper function to fetch data based on sitelist
    const result = await fetchSitelistData(sitelist);

    // Return the data as a JSON response
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Helper function to query the database based on the sitelist
async function fetchSitelistData(sitelist) {
  let conn;
  let query = "SELECT * FROM fat_list WHERE id IN (?)";
  try {
    conn = await dbConnect('pegasus').getConnection();
    const [rows] = await conn.query(query, [sitelist]);
    return rows;
  } catch (error) {
    console.error('Error querying database:', error);
    throw new Error('Database query failed');
  } finally {
    dbConnect('pegasus').releaseConnection();
    conn.close();
  }
}

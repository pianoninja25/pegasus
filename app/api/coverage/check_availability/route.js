import { getServerSession } from "next-auth/next";
import options from '../../auth/[...nextauth]/options';
import dbConnect from "@/utils/db-homepass"; 

export async function GET(req) {
  const pfatid = req.nextUrl.searchParams.get("fatid");

  const q = `
    SELECT 
    c.stateOrProvince Province,
    c.city City,
    c.locality Locality,
    c.postcode 'Post Code',
    a.type Type,
    a.id Homepass	
  FROM GeographicSite a
    LEFT JOIN DeviceInUse b ON a.id=b.deviceId
    LEFT JOIN GeographicAddress c ON a.address=c.id
  WHERE 
    siteRelationship=${pfatid} AND
    b.status IS NULL 
  LIMIT 1;
`


  const session = await getServerSession(options);
  if (!session) {
    return new Response(JSON.stringify({ message: "You don't have the authorization!" }), { status: 401 });
  }

  let conn;
  try {
    // conn = await dbConnect('HomepassManagement').getConnection();
    conn = await dbConnect('pegasus').getConnection();
    const [rows] = await conn.query(q);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error querying database:', error);
    return new Response('Internal Server Error', { status: 500 });
  } finally {
    dbConnect('pegasus').releaseConnection()
    conn.close()
  }
}

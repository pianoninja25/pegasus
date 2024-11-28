import { getServerSession } from "next-auth/next";
import options from '../auth/[...nextauth]/options';
import orderHub from "@/utils/db-orderHub";

export async function GET(req) {
  const pquery = req.nextUrl.searchParams.get("query");
  const pclient = req.nextUrl.searchParams.get("client");

  let q = `CALL workorder_list('Dankom')`;
  // if(pquery === 'check_coverage') {
  //   q = `CALL check_coverage('${pclient}', ${plong}, ${plat});`;
  // } 
  // else if(pquery === 'check_availability') {
  //   q = `CALL check_availability('${pfatid}');`;
  // } 
  // else if(pquery === 'sample_client_sitelist') {
  //   q = `CALL sample_client_sitelist('${pclient}');`;
  // }

  console.log(q);

  const session = await getServerSession(options);
  if (!session) {
    return new Response(JSON.stringify({ message: "You don't have the authorization!" }), { status: 401 });
  }

  if (pquery) {
    let conn;
    try {
      conn = await orderHub('orders').getConnection();
      const [rows] = await conn.query(q);
      return new Response(JSON.stringify(rows[0] || rows), { status: 200 });
    } catch (error) {
      console.error('Error querying database:', error);
      return new Response('Internal Server Error', { status: 500 });
    } finally {
      orderHub('orders').releaseConnection()
    }
  } else {
    return new Response('404 | This page could not be found.', { status: 404 });
  }
}

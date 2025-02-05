import { getServerSession } from "next-auth/next";
import options from '../auth/[...nextauth]/options';
import dbConnect from "@/utils/db-connection"; 

export async function GET(req) {
  const pquery = req.nextUrl.searchParams.get("query");
  const pclient = req.nextUrl.searchParams.get("client");
  const plong = req.nextUrl.searchParams.get("long");
  const plat = req.nextUrl.searchParams.get("lat");
  const pfatid = req.nextUrl.searchParams.get("fatid");
  const psitelist = req.nextUrl.searchParams.get("sitelist");
  

  let q;
  if(pquery === 'check_coverage') {
    q = `CALL check_coverage('${pclient}', ${plong}, ${plat});`;
  } 
  else if(pquery === 'check_availability') {
    q = `CALL check_availability('${pfatid}');`;
  } 
  else if(pquery === 'sample_client_sitelist') {
    q = `CALL sample_client_sitelist('${pclient}');`;
  }
  else if(pquery === 'find_fatid') {
    // console.log(query, sitelist)
    const arraysiteid = JSON.parse(psitelist)
    const formattedsiteid = arraysiteid.map(id => `'${id}'`).join(', ');
    q = `SELECT *, ST_ASTEXT(geolocation) 
      FROM fat_list 
      WHERE siteid IN (${formattedsiteid});
    `

  }


  // const session = await getServerSession(options);
  // if (!session) {
  //   return new Response(JSON.stringify({ message: "You don't have the authorization!" }), { status: 401 });
  // }

  if (pquery) {
    let conn;
    try {
      conn = await dbConnect('pegasus').getConnection();
      const [rows] = await conn.query(q);
      return new Response(JSON.stringify(rows[0] || rows), { status: 200 });
    } catch (error) {
      console.error('Error querying database:', error);
      return new Response('Internal Server Error', { status: 500 });
    } finally {
      dbConnect('pegasus').releaseConnection()
      conn.close()
    }
  } else {
    return new Response('404 | This page could not be found.', { status: 404 });
  }
}

import { getServerSession } from "next-auth/next";
import options from '../auth/[...nextauth]/options';
import dbConnect from "@/utils/db-connection"; 

export async function GET(req) {
  const pquery = req.nextUrl.searchParams.get("query");
  const ptenant = req.nextUrl.searchParams.get("tenant");

  let q;
  if(pquery === 'test_geo') {
    q = `CALL test_geo('${ptenant}');`;
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

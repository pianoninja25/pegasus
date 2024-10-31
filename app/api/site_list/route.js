import { getServerSession } from "next-auth/next"
import options from '@/app/api/auth/[...nextauth]/options'
import dbConnet from "@/utils/db-connection" 

export async function GET(req) {
  const session = await getServerSession(options)
  const puser = req.nextUrl.searchParams.get("user");


  let queryStr = `CALL select_sitelist('${puser}');`
  // let queryStr = `CALL select_sitelist();`

  try {
    if(!session && !queryStr) {
      return Response.json({ message: "You don't have the authorization!" }, { status: 403 });
    } 
    else {
      const conn = await dbConnet('jatayu').getConnection()
      
      return conn.query(queryStr)
      .then(result => {
        const [rows, fields] = result
        return Response.json(rows[0])
        // return new Response(JSON.stringify({
        //   data: rows[0],
        //   status: 200
        // }), { status: 200 });
      })
      .then((r) => {
          conn.close()
          return r
      })
    } 
  } catch (error) {
    console.error('Error querying database:', error)
  }
}





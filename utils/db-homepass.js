import mysql from 'mysql2/promise'


const OperationDB = (dbname) => {
  return (
    mysql.createPool({
      host: process.env.HPASS_HOST,
      user: process.env.HPASS_USER,
      password: process.env.HPASS_PASS,
      database: dbname
    })
  )
}


export default OperationDB


import mysql from 'mysql2/promise'


const OperationDB = (dbname) => {
  return (
    mysql.createPool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASS,
      database: dbname
    })
  )
}


export default OperationDB


import mysql from 'mysql2/promise'


const OrderHub = (dbname) => {
  return (
    mysql.createPool({
      host: process.env.ORDERS_HOST,
      user: process.env.ORDERS_USER,
      password: process.env.ORDERS_PASS,
      database: dbname
    })
  )
}


export default OrderHub


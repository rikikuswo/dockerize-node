const mysql = require('mysql2');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// ✅ MySQL Connection
// const mysqlConnection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASS,
//   database: process.env.MYSQL_DB
// });

// mysqlConnection.connect(err => {
//   if (err) {
//     console.error('MySQL connection error:', err);
//   } else {
//     console.log('✅ MySQL connected');
//   }
// });

// ✅ MongoDB Connection
let mongoClient;

async function connectMongoDB() {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    mongoClient = client;
    console.log('✅ MongoDB connected');
    const db = client.db(process.env.MONGO_DB_NAME);
    return db;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

module.exports = {
//   mysqlConnection,
  mongoClient,
  connectMongoDB // ✅ Now this is exported
};

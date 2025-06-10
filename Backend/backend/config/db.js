const mysql = require("mysql2");

// Create a connection pool (better than single connection)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "ticketing_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Use .promise() for async queries
const promiseDB = db.promise();

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
    connection.release();
  }
});

// Export only `promiseDB` (not `db` separately)
module.exports = promiseDB;

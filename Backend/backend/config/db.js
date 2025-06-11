const mysql = require("mysql2");

// Create a connection pool (better than single connection)
const db = mysql.createPool({
  host: "ticketing-system.cf4s4uc0ovlv.eu-north-1.rds.amazonaws.com",
  user: "admin",
  password: "SARATHY(08)",
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

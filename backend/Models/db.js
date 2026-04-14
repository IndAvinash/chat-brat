const mysql = require("mysql2/promise"); // Use promise-based version

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat-brat_users",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
db.getConnection()
  .then(() => console.log("Connected to MySQL database"))
  .catch(err => console.error("Database connection failed:", err));

module.exports = db;
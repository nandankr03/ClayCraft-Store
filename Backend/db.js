const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nandan@95728",
  database: "clay_pottery"
});

db.connect((err) => {
  if (err) {
    console.log(" Database connection failed");
    console.log(err);
  } else {
    console.log(" Database connected successfully");
  }
});

module.exports = db;
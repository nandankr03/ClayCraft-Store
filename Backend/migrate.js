const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nandan@95728",
  database: "clay_pottery"
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting: " + err.message);
    return;
  }
  
  const query = "ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'customer'";
  connection.query(query, (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log("Column 'role' already exists.");
      } else {
        console.error("Error updating table: " + err.message);
      }
    } else {
      console.log("Successfully added 'role' column to users table.");
    }
    connection.end();
  });
});

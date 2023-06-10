const Pool = require("pg").Pool
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ninefoxlab-internship-solution",
    password: "Rn$i$v4ryg00d",
    port: 5432,
  });
  
  module.exports = pool
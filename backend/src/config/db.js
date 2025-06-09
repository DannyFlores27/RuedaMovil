const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});
console.log("📦 Cargando variables de entorno...");
console.log("MYSQL_USER:", process.env.MYSQL_USER);
console.log("MYSQL_PASSWORD:", process.env.MYSQL_PASSWORD ? "****" : "(vacío)");
console.log("MYSQL_DATABASE:", process.env.MYSQL_DATABASE);

module.exports = pool;

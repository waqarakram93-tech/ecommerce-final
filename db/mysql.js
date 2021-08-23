// var mysql = require('mysql');
import mysql from 'mysql'


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'P642wa4454758',
    database: 'ecommerece_database'
});

export default connection
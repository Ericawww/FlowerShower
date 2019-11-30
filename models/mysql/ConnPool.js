let mysql = require('mysql2/promise');

module.exports = (function () {
    var pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'unitsys',
        port: '3306',
        charset: 'utf8mb4'
    });
    pool.on('connection', function (connection) {
        connection.query('SET SESSION auto_increment_increment=1');
    });
    return pool;
})();
const mysql2 = require('mysql2/promise');


class DatabaseAccess {
    constructor (hostData) {
        this.hostData = hostData;
    }

    async dbConnection() {
        if (this.connection) {
            return this.connection;
        }
        const connection = await mysql2.createConnection(this.hostData);

        console.log('connected to the business_db database.');
        return connection;
    }

    async query() {
        this.connection = await this.dbConnection();
        const [rows] = await this.connection.execute(this.sql, this.values);
        return rows;
    }
}

module.exports = DatabaseAccess;
const mysql2 = require('mysql2/promise');


class DatabaseAccess {
    constructor (hostData) {
        this.hostData = hostData;
    }

    async dbConnection() {
        if (this.connection) {
            return this.connection;
        }
        this.connection = await mysql2.createConnection(this.hostData);
        console.log('connected to the business_db database.');
    }

    async query(sql, values) {
        const [rows] = await this.connection.execute(sql, values);
        return rows;
    }

    async dbQuery(sql) { 
        const result = await this.query(this.sql);
        return result;
    } 
}

module.exports = DatabaseAccess;
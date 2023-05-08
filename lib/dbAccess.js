const mysql2 = require('mysql2/promise');

class DbAccess {
    constructor (localHostData) {
        this.localHostData = localHostData;
    }

    async dbConnection() {
        if (this.connection) {
            return this.connection;
        }
        this.connection = await mysql2.createConnection(this.localHostData);

        console.log('connected to the business_db database.');
        return this.connection;
    }

    async query() {
        this.connection = await this.dbConnection();
        const [table] = await this.connection.execute(this.sql, this.values);
        return table;
    }
}

module.exports = DbAccess;
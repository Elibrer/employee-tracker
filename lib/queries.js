const DatabaseAccess = require('../public/connection');
const hostData = require('./hostData.json');

class ViewAllDepartments extends DatabaseAccess {
    constructor(hostData) {
        super(hostData);
        this.sql = `SELECT name FROM department`;
      }
}

class ViewAllRoles extends DatabaseAccess {
    constructor(hostData) {
        super(hostData);
        this.sql = `SELECT title FROM role`;
      }
}

class ViewAllEmployees extends DatabaseAccess {
    constructor(hostData) {
        super(hostData);
        this.sql = `SELECT first_name, last_name FROM employee`;
        }
}


module.exports = {ViewAllDepartments, ViewAllRoles, ViewAllEmployees};
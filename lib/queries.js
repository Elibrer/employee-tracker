const DatabaseAccess = require('../public/connection');
const hostData = require('./hostData.json');

class ViewAllDepartments extends DatabaseAccess {
    constructor(hostData) {
        super(hostData);
        this.sql = `SELECT name, id AS Departments FROM department`;
      }
}

class ViewAllRoles extends DatabaseAccess {
    constructor(hostData) {
        super(hostData);
        // this.sql = `SELECT roles.title AS Title, roles.id AS RoleId, FROM role`;
        this.sql = `SELECT roles.id AS RoleId, title AS Title, salary 
        FROM role
        JOIN department ON role.department_id = department.id `;

      }
}

class ViewAllEmployees extends DatabaseAccess {
    constructor(hostData) {
        super(hostData);
        this.sql = `SELECT first_name, last_name FROM employee`;
        }
}

class AddDepartment extends DatabaseAccess {
    constructor(hostData, name) {
        super(hostData);
        this.name = name;
        this.sql = `INSERT INTO department (name) VALUES ('${name}')`;

    }
}

class AddRole extends DatabaseAccess {
    constructor(hostData, title, salary, department_id) {
        super(hostData);
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
        this.paramString = `'${title}', ${salary}, ${department_id}`;

        this.sql = `INSERT INTO role (title, salary, department_id) VALUES (${this.paramString})`;
    }
}

module.exports = {ViewAllDepartments, ViewAllRoles, ViewAllEmployees, AddDepartment, AddRole};
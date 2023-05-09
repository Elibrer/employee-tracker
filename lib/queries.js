const DbAccess = require('./dbAccess');
const cTable = require('console.table');


class ViewAllDepartments extends DbAccess {
    constructor(hostData) {
        super(hostData);
        this.sql = `SELECT id AS \`Department Id\`, name AS \`Department Name\` FROM department`;
      }
}

class ViewAllRoles extends DbAccess {
    constructor(hostData) {
        super(hostData);
        this.sql = `SELECT role.id AS \`Role Id\`, title AS \`Role Title\`, department.name AS Department, CONCAT('$', FORMAT(salary, 2)) AS \`Salary\`
        FROM role
        JOIN department ON role.department_id = department.id 
        ORDER BY role.id ASC;`;
      }
}

class ViewAllEmployees extends DbAccess {
    constructor(hostData) {
        super(hostData);
        this.sql = `
                    SELECT employee.id AS \`Employee Id\`, 
                    employee.first_name AS \`First Name\`, 
                    employee.last_name AS \`Last Name\`, 
                    role.title AS \`Role Title\`, 
                    department.name AS \`Department\`, 
                    CONCAT('$', FORMAT(salary, 2)) AS \`Salary\`,
                    CONCAT(manager.first_name, ' ', manager.last_name) AS \`Manager Name\`

        FROM employee employee
        LEFT JOIN employee manager ON employee.manager_id = manager.id
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        ORDER BY employee.id ASC;`;
        }
}

class ViewManagers extends DbAccess {
    constructor(hostData) {
        super(hostData);
        this.sql = `SELECT employee.id AS \`Manager Id\`, CONCAT(employee.first_name, ' ', employee.last_name) AS \`Manager Name\`, role.title AS \`Role Title\`, CONCAT('$', FORMAT(salary, 2)) AS \`Salary\`
        FROM employee employee
        JOIN role ON employee.role_id = role.id
        WHERE role.title LIKE '%manager%'
        GROUP BY CONCAT(employee.first_name, ' ', employee.last_name), role.title, employee.id
        ORDER BY employee.id ASC;
        `
    }
}

class ViewEmployeesByManager extends DbAccess {
    constructor(hostData, manager_id) {
        super(hostData);
        this.manager_id = manager_id;
        this.sql = `SELECT employee.id AS \`Employee Id\`,
        employee.first_name AS \`First Name\`,
        employee.last_name AS \`Last Name\`,
        role.title AS \`Role Title\`,
        CONCAT(manager.first_name, ' ', manager.last_name) AS \`Manager Name\`
        FROM employee employee

        LEFT JOIN employee manager ON employee.manager_id = manager.id
        JOIN role ON employee.role_id = role.id
        WHERE employee.manager_id = ${manager_id}
        ORDER BY employee.id ASC;`;
    }
}

class ViewCombinedSalaries extends DbAccess {
    constructor(hostData, department) {
        super(hostData);
        this.department = department;
        //sql to get the sum of salaries for a given department by this.department
        this.sql = `SELECT department.name AS \`Department\`, CONCAT('$', FORMAT(SUM(role.salary), 2)) AS \`Combined Salaries\`
        FROM employee employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        WHERE department.name = '${this.department}'
        GROUP BY department.name;`;
    }
}

class AddDepartment extends DbAccess {
    constructor(hostData, name) {
        super(hostData);
        this.name = name;
        this.sql = `INSERT INTO department (name) VALUES ('${name}')`;

    }
}

class AddRole extends DbAccess {
    constructor(hostData, title, salary, department_id) {
        super(hostData);
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
        this.paramString = `'${title}', ${salary}, ${department_id}`;

        this.sql = `INSERT INTO role (title, salary, department_id) VALUES (${this.paramString})`;
    }
}

class AddEmployee extends DbAccess {
    constructor(hostData, first_name, last_name, role_id, manager_id) {
        super(hostData);
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
        this.paramString = `'${first_name}', '${last_name}', ${role_id}, ${manager_id}`;

        this.sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${this.paramString})`;
    }
}

class UpdateEmployeeRole extends DbAccess {
    constructor(hostData, employee_id, role_id) {
        super(hostData);
        this.role_id = role_id;
        this.employee_id = employee_id;
        this.sql = `SELECT employee.id AS \`Employee Id\`, 
                    employee.first_name AS \`First Name\`, 
                    employee.last_name AS \`Last Name\`, 
                    role.title AS \`Role Title\`,
                    role.id AS \`Role Id\`

        FROM employee
        JOIN role ON employee.role_id = role.id
        WHERE employee.id = '${this.employee_id}';`

        this.updateQuery = `UPDATE employee SET role_id = ${this.role_id} WHERE id = '${this.employee_id}'`;
    }
}

class UpdateEmployeeManager extends DbAccess {
    constructor(hostData, employee_id, manager_id) {
        super(hostData);
        this.manager_id = manager_id;
        this.employee_id = employee_id;
        this.sql = `SELECT employee.id AS \`Employee Id\`,
                    employee.first_name AS \`First Name\`,
                    employee.last_name AS \`Last Name\`,
                    CONCAT(manager.first_name, ' ', manager.last_name) AS \`Manager Name\`,
                    manager.id AS \`Manager Id\`

        FROM employee employee
        LEFT JOIN employee manager ON employee.manager_id = manager.id
        WHERE employee.id = '${this.employee_id}';`
        
        this.updateQuery = `UPDATE employee SET manager_id = ${this.manager_id} WHERE id = '${this.employee_id}'`;
    }
}

class DeleteQuery extends DbAccess {
    constructor(hostData, sql, table, id) {
        super(hostData);
        this.table = table
        this.id = id;
        this.sql = `SELECT ${sql} FROM ${this.table} WHERE id = '${this.id}'`;
        this.deleteQuery = `DELETE FROM ${this.table} WHERE id = '${this.id}'`;
    }

    async newDeleteQuery() {
        await this.dbConnection();
        await this.connection.execute(this.deleteQuery);
    }
}

module.exports = { ViewAllDepartments, ViewAllRoles, ViewAllEmployees, ViewManagers, ViewEmployeesByManager, ViewCombinedSalaries, AddDepartment, AddRole, AddEmployee, UpdateEmployeeRole, UpdateEmployeeManager, DeleteQuery };
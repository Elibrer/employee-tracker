const inquirer = require('inquirer');
const hostData = require('./hostData.json');
const init = require('./cli.js');
const {ViewAllDepartments, ViewAllRoles, ViewAllEmployees, AddDepartment, AddRole, ViewManagers, AddEmployee, UpdateEmployeeRole, DeleteQuery} = require('./queries.js');


const localHostData = hostData[0];


const viewAllDepartments = async () => {
    const viewDepartments = new ViewAllDepartments(localHostData);
    const departments = await viewDepartments.query();
    return departments;
}

const viewAllRoles = async () => {
    const viewRoles = new ViewAllRoles(localHostData);
    const rolesTable = await viewRoles.query();
    return rolesTable;
}

const viewAllEmployees = async () => {
    const viewEmployees = new ViewAllEmployees(localHostData);
    const employeesTable = await viewEmployees.query();
    return employeesTable;
}

const viewManagers = async () => {
    const viewManagers = new ViewManagers(localHostData);
    const managersTable = await viewManagers.query();
    return managersTable;
}

const addDepartment = async () => {
    let { name } = await inquirer.prompt(
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department you would like to add?'
        }
    );
    name = name.charAt(0).toUpperCase() + name.slice(1);
    const addDepartment = new AddDepartment(localHostData, name);
    await addDepartment.query();
    return name;
}

const addRole = async () => {
    let { role, salary } = await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'role',
                message: 'What is the title of the role you would like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role you would like to add? (to the nearest thousand)'
            }
        ]
    );

    if (isNaN(salary)) {
        console.log('Please enter a number.');
        return addRole();
    }
    if (salary < 1000) {
        console.log('Please enter salary to the nearest thousand.');
        return addRole();
    }
    role = role.charAt(0).toUpperCase() + role.slice(1);


    const departments = await viewAllDepartments();
    console.table(departments);

    const { department_id } = await inquirer.prompt(
        {
            type: 'input',
            name: 'department_id',
            message: 'What is the department ID of the role you would like to add? Relate to the table above.'
        }
    );
    if (isNaN(department_id)) {
        console.log('Please enter a number.');
        return addRole();
    }

    const addNewRole = new AddRole(localHostData, role, salary, department_id);
    await addNewRole.query();
    return role;
}

const addEmployee = async () => {
    
    const { first_name, last_name } = await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the first name of the employee you would like to add?' 
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the last name of the employee you would like to add?' 
            }
        ]
    );
    
    const roles = await viewAllRoles();
    console.table(roles)

    const { role_id } = await inquirer.prompt(
        {
            type: 'input',
            name: 'role_id',
            message: 'What is the role Id of the employee you would like to add? Relate to the table above.'
        }
    );

    const managers = await viewManagers();
    console.table(managers);

    const { manager_id } = await inquirer.prompt(
        {
            type: 'input',
            name: 'manager_id',
            message: 'What is the manager Id of the employee you would like to add? Relate to the table above (NULL if none).'
        }
    );
    const addNewEmployee = new AddEmployee(localHostData, first_name, last_name, role_id, manager_id);
    await addNewEmployee.query();
    return first_name + " " + last_name;
}

const updateEmployeeRole = async () => {
    const employees = await viewAllEmployees();
    console.table(employees);
    
    const { employee_id } = await inquirer.prompt(
        {
            type: 'input',
            name: 'employee_id',
            message: 'What is the id of the employee you would like to update? Relate to the table above.'
        }
    );
    const roles = await viewAllRoles();
    console.table(roles);

    const { role_id } = await inquirer.prompt(
        {
            type: 'input',
            name: 'role_id',
            message: 'What is the role id of the employee you would like to update them to? Relate to the table above.'
        }
    );
    const updateEmployeeRole = new UpdateEmployeeRole(localHostData, employee_id, role_id);
    const updatedEmployee = await updateEmployeeRole.query();
    let updatedEmployeeName = Object.values(updatedEmployee[0])[1] + " " + Object.values(updatedEmployee[0])[2];
    let updatedEmployeeRole = Object.values(updatedEmployee[0])[3];
    return { updatedEmployeeName, updatedEmployeeRole };
}


const deleteEntry = async (table) => {
    try {
        console.log(table)
        let entry = ''
        let sql = ''
        switch(table) {
            case 'department':
            entry = await viewAllDepartments();
            console.table(entry);
            sql = 'name, id';
            break;
            case 'role':
            entry = await viewAllRoles();
            console.table(entry);
            sql = 'title, id';
            break;
            case 'employee':
            entry = await viewAllEmployees();
            console.table(entry);
            sql = 'first_name, id, last_name';
            break;
        }
        
        const { id } = await inquirer.prompt(
            {
                type: 'input',
                name: 'id',
                message: 'What is the id of the table entry you would like to delete? Relate to the table above.'
            }
        );
        const deleteEntry = new DeleteQuery(localHostData, sql, table, id);
        const deletedEntry = await deleteEntry.query();
        await deleteEntry.newDeleteQuery();

            

        let name = Object.values(deletedEntry[0])[0];
        const query_id = Object.values(deletedEntry[0])[1];
        const last_name = Object.values(deletedEntry[0])[2];

        if (table === 'employee') {
            name = name + " " + last_name;
        }

        return { name, query_id };

    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            console.error(err)
          throw new Error('\x1b[41mPlease remove all foreign key entries associated with this table before deleting.\x1b[0m');
        } else {
            throw err;    
        }
    }    
}



module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, viewManagers, updateEmployeeRole, deleteEntry };
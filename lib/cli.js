const inquirer = require('inquirer');
require('dotenv').config();
const DatabaseAccess = require('./dbAccess.js');
const { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, updateEmployeeManager, deleteEntry } = require('./queryFunctions.js');


const init = async () => {

    localHostData = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,   
        database: process.env.DB_NAME
    };

    const databaseConnect = new DatabaseAccess(localHostData);
    await databaseConnect.dbConnection();

    try {
        const sqlDb = await inquirer.prompt(
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Update an employees manager', 'Delete an entry', 'Exit']
            }
        ); 

        let employeeName = '';
        let role = '';
        let employeeManager = '';
        let department = '';
        let table = '';

        switch (sqlDb.action) {
            case 'View all departments':
                const departments = await viewAllDepartments(localHostData);
                console.table(departments);
                return init();
            case 'View all roles':
                const roles = await viewAllRoles(localHostData);
                console.table(roles);
                return init();
            case 'View all employees':
                const employees = await viewAllEmployees(localHostData);
                console.table(employees)
                return init();
            case 'Add a department':
                department = await addDepartment(localHostData);
                console.log(`\x1b[30;47mAdded ${department} to the database.\x1b[0m`);
                return init();
            case 'Add a role':
                role = await addRole(localHostData);
                console.log(`\x1b[30;47mAdded ${role} to the database.\x1b[0m`);
                return init();
            case 'Add an employee':
                employeeName = await addEmployee(localHostData);
                console.log(`\x1b[30;47mAdded ${employeeName} to the database.\x1b[0m`);
                return init();
            case 'Update an employee role':
                ({ employeeName, role } = await updateEmployeeRole(localHostData));
                console.log(`\x1b[30;47mUpdated ${employeeName} to be in the ${role} role.\x1b[0m`)
                return init();
            case 'Update an employees manager':
                ({ employeeName, employeeManager } = await updateEmployeeManager(localHostData));
                console.log(`\x1b[30;47mUpdated ${employeeName} to be managed by ${employeeManager}.\x1b[0m`)
                return init();
            case 'Delete an entry':
                ({ table } = await inquirer.prompt(
                    {
                        type: 'list',
                        name: 'table',
                        message: 'What table would you like to delete from?',
                        choices: ['department', 'role', 'employee']
                    }
                ));  
                let { name, query_id} = await deleteEntry(localHostData, table);
                console.log(`\x1b[30;47mDeleted ${name} with ${table} id = ${query_id} from the ${table} table.\x1b[0m`);
                return init();
            default:
                process.exit();
        }
    }
    catch (err) {
        console.log(err);
    }
};

module.exports = init;
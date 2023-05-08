const inquirer = require('inquirer');
const hostData = require('./hostData.json');
const DatabaseAccess = require('./dbConnection.js');
const { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, deleteEntry } = require('./queryFunctions.js');


const init = async () => {

    localHostData = hostData[0];
    const databaseConnect = new DatabaseAccess(localHostData);
    await databaseConnect.dbConnection();

    try {
        const sqlDb = await inquirer.prompt(
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Delete an entry', 'Exit']
            }
        ); 

        switch (sqlDb.action) {
            case 'View all departments':
                const departments = await viewAllDepartments();
                console.table(departments);
                return init();
            case 'View all roles':
                const roles = await viewAllRoles();
                console.table(roles);
                return init();
            case 'View all employees':
                const employees = await viewAllEmployees();
                console.table(employees)
                return init();
            case 'Add a department':
                const newDepartmentName = await addDepartment();
                console.log(`\x1b[30;47mAdded ${newDepartmentName} to the database.\x1b[0m`);
                return init();
            case 'Add a role':
                const newRoleName = await addRole();
                console.log(`\x1b[30;47mAdded ${newRoleName} to the database.\x1b[0m`);
                return init();
            case 'Add an employee':
                const employeeName = await addEmployee();
                console.log(`\x1b[30;47mAdded ${employeeName} to the database.\x1b[0m`);
                return init();
            case 'Update an employee role':
                const { updatedEmployeeName, updatedEmployeeRole } = await updateEmployeeRole();
                console.log(`\x1b[30;47mUpdated ${updatedEmployeeName} to be in the ${updatedEmployeeRole} role.\x1b[0m`)
                return init();
            case 'Delete an entry':
                const { table } = await inquirer.prompt(
                    {
                        type: 'list',
                        name: 'table',
                        message: 'What table would you like to delete from?',
                        choices: ['department', 'role', 'employee']
                    }
                );  
                const { name, query_id} = await deleteEntry(table);
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
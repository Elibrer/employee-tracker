const inquirer = require('inquirer');
require('dotenv').config();
const DatabaseAccess = require('./dbAccess.js');
const { viewAllDepartments, viewAllRoles, viewAllEmployees, viewManagers, viewEmployeesByManager, addDepartment, addRole, addEmployee, updateEmployeeRole, updateEmployeeManager, deleteEntry } = require('./queryFunctions.js');


const init = async () => {

    //Establishes a connection to the database using a .env file *USER WILL HAVE TO PROVIDE OWN .env FILE*
    localHostData = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,   
        database: process.env.DB_NAME
    };

    const databaseConnect = new DatabaseAccess(localHostData);
    await databaseConnect.dbConnection();

    //Main menu to select what to do
    try {
        const sqlDb = await inquirer.prompt(
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View', 'Add', 'Update', 'Delete', 'Exit']
        });

        //Variables to store user input for queries
        let employees = '';
        let employeeName = '';
        let role = '';
        let employeeManager = '';
        let department = '';
        let table = '';

        //Switch statement to determine what to do based on main menu selection
        switch (sqlDb.action) {
            case 'View':
                const sqlView = await inquirer.prompt(
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to view?',
                    choices: ['Departments', 'Roles', 'Employees', 'Managers', 'Employees by manager', 'Combined department salaries', 'Exit']
                });
                switch (sqlView.action) {
                    case 'Departments':
                        const departments = await viewAllDepartments(localHostData);
                        console.table(departments);
                        return init();
                    case 'Roles':
                        const roles = await viewAllRoles(localHostData);
                        console.table(roles);
                        return init();
                    case 'Employees':
                        employees = await viewAllEmployees(localHostData);
                        console.table(employees)
                        return init();
                    case 'Managers':
                        const managers = await viewManagers(localHostData);
                        console.table(managers);
                        return init();
                    case 'Employees by manager':
                        employees = await viewEmployeesByManager(localHostData);
                        console.table(employees);
                        return init();
                    case 'Combined department salaries':
                        const combinedSalaries = await viewCombinedSalaries(localHostData);
                        console.table(combinedSalaries);
                        return init();
                    default:
                        process.exit();
                }

            case 'Add':
                const sqlAdd = await inquirer.prompt(
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to add?',
                    choices: ['Department', 'Role', 'Employee', 'Exit']
                });
                switch (sqlAdd.action) {
                    case 'Department':
                        department = await addDepartment(localHostData);
                        console.log(`\x1b[30;47mAdded ${department} to the database.\x1b[0m`);
                        return init();
                    case 'Role':
                        role = await addRole(localHostData);
                        console.log(`\x1b[30;47mAdded ${role} to the database.\x1b[0m`);
                        return init();
                    case 'Employee':
                        employeeName = await addEmployee(localHostData);
                        console.log(`\x1b[30;47mAdded ${employeeName} to the database.\x1b[0m`);
                        return init();
                    default:
                        process.exit();
                }

            case 'Update':
                const sqlUpdate = await inquirer.prompt(
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to update?',
                    choices: ['Employee role', 'Employee manager', 'Exit']
                });
                switch (sqlUpdate.action) {
                    case 'Employee role':
                        ({ employeeName, role } = await updateEmployeeRole(localHostData));
                        console.log(`\x1b[30;47mUpdated ${employeeName}'s role to ${role}.\x1b[0m`);
                        return init();
                    case 'Employee manager':
                        ({ employeeName, employeeManager } = await updateEmployeeManager(localHostData));
                        console.log(`\x1b[30;47mUpdated ${employeeName}'s manager to ${employeeManager}.\x1b[0m`);
                        return init();
                    default:
                        process.exit();
                }

            case 'Delete':
                ({ table } = await inquirer.prompt(
                    {
                        type: 'list',
                        name: 'table',
                        message: 'What table would you like to delete from?',
                        choices: ['Department', 'Role', 'Employee']
                    }
                ));  
                let { name, query_id} = await deleteEntry(localHostData, table);
                console.log(`\x1b[30;47mDeleted ${name} with ${table} id = ${query_id} from the ${table} table.\x1b[0m`);
                return init();
            default:
                process.exit();
        }
    } catch (err) {
        console.log(err);
    }
};
       
module.exports = init;
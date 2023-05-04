const inquirer = require('inquirer');
const {ViewAllDepartments, ViewAllRoles, ViewAllEmployees} = require('./queries.js');
const hostData = require('./hostData.json');


const init = async () => {
    try {
        const sqlDb = await inquirer.prompt(
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
            }
        ); 
        localHostData = hostData[0];

        switch (sqlDb.action) {
            case 'View all departments':
                const viewDepartments = new ViewAllDepartments(localHostData);
                await viewDepartments.dbConnection();
                const departments = await viewDepartments.dbQuery();

                console.table(departments);

                return init();
            case 'View all roles':
                const viewRoles = new ViewAllRoles(localHostData);
                await viewRoles.dbConnection();
                const roles = await viewRoles.dbQuery();

                console.table(roles);
                return init();
            case 'View all employees':
                return init();
            case 'Add a department':
                return init();
            case 'Add a role':
                return init();
            case 'Add an employee':
                return init();
            case 'Update an employee role':
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
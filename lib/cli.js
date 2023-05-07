const inquirer = require('inquirer');
const {ViewAllDepartments, ViewAllRoles, ViewAllEmployees, AddDepartment, AddRole} = require('./queries.js');
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
                const viewEmployees = new ViewAllEmployees(localHostData);
                await viewEmployees.dbConnection();
                const employees = await viewEmployees.dbQuery();
                console.table(employees)
                return init();
            case 'Add a department':
                const departmentName = await inquirer.prompt(
                    {
                        type: 'input',
                        name: 'name',
                        message: 'What is the name of the department you would like to add?'
                    }
                );
                const name = departmentName.name;
                const addDepartment = new AddDepartment(localHostData, name);
                await addDepartment.dbConnection();
                const newDepartment = await addDepartment.dbQuery();
                console.log(`Added ${name} to the database.`);
                return init();
            case 'Add a role':
                const roleInfo = await inquirer.prompt(
                    [
                        {
                            type: 'input',
                            name: 'title',
                            message: 'What is the title of the role you would like to add?'
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'What is the salary of the role you would like to add? (two digits to the nearest thousand)'
                        }
                    ]
                );
                const departmentTable = new ViewAllDepartments(localHostData);
                await departmentTable.dbConnection();
                const departmentsTable = await departmentTable.dbQuery();
                console.table(departmentsTable);

                const roleInfo2 = await inquirer.prompt(
                    {
                        type: 'input',
                        name: 'department_id',
                        message: 'What is the department ID of the role you would like to add? Relate to the table above.'
                    }
                );
                const addNewRole = new AddRole(localHostData, roleInfo.title, roleInfo.salary, roleInfo2.department_id);
                await addNewRole.dbConnection();
                const newRole = await addNewRole.dbQuery();
                console.log(`Added ${roleInfo.title} to the database.`);
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
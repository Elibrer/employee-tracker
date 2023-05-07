const inquirer = require('inquirer');
const hostData = require('./hostData.json');
const { viewAllDepartments, viewAllRoles, viewAllEmployees } = require('./queryFunctions.js');


const init = async () => {
    localHostData = hostData[0];
    try {
        const sqlDb = await inquirer.prompt(
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Delete a department', 'Delete a role', 'Delete an employee', 'Exit']
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
                            message: 'What is the salary of the role you would like to add? (to the nearest thousand)'
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
                

                const employeeName = await inquirer.prompt(
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
                
                const viewRoles = new ViewAllRoles(localHostData);
                await viewRoles.dbConnection();
                const rolesTable = await viewRoles.dbQuery();
                console.table(rolesTable);

                const roleID = await inquirer.prompt(
                    {
                        type: 'input',
                        name: 'role_id',
                        message: 'What is the role Id of the employee you would like to add? Relate to the table above.'
                    }
                );

                const viewManagers = new ViewManagers(localHostData);
                await viewManagers.dbConnection();
                const managersTable = await viewManagers.dbQuery();
                console.table(managersTable);

                const managerID = await inquirer.prompt(
                    {
                        type: 'input',
                        name: 'manager_id',
                        message: 'What is the manager Id of the employee you would like to add? Relate to the table above.'
                    }
                );


                const addNewEmployee = new AddEmployee(localHostData, employeeName.first_name, employeeName.last_name, roleID.role_id, managerID.manager_id);
                await addNewEmployee.dbConnection();
                const newEmployeeTable = await addNewEmployee.dbQuery();
                console.log(`Added ${employeeName.first_name} ${employeeName.last_name} to the database.`);
                return init();
            case 'Update an employee role':
                return init();
            case 'Delete a department':



                const viewDepartments = new ViewAllDepartments(localHostData);
                await viewDepartments.dbConnection();
                const departmentsTable2 = await viewDepartments.dbQuery();
                console.table(departmentsTable2);

                const deleteDepartmentID = await inquirer.prompt(
                    {
                        type: 'input',
                        name: 'id',
                        message: 'What is the id of the department you would like to delete? Relate to the table above.'
                    }
                );
                const deleteDepartment = new DeleteDepartment(localHostData, deleteDepartmentID.id);
                await deleteDepartment.dbConnection();
                const deletedDepartment = await deleteDepartment.dbQuery();
                console.log(`Deleted ${deleteDepartmentID.id} from the database.`);
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
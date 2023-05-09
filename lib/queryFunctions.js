const inquirer = require('inquirer');
const { ViewAllDepartments, ViewAllRoles, ViewAllEmployees, AddDepartment, AddRole, ViewManagers, ViewEmployeesByManager, ViewCombinedSalaries, AddEmployee, UpdateEmployeeRole, UpdateEmployeeManager, DeleteQuery } = require('./queries.js');
const errorCheck = require('./errorCheck.js');
const cTable = require('console.table');

const viewAllDepartments = async (localHostData) => {
    const viewDepartments = new ViewAllDepartments(localHostData);
    const departments = await viewDepartments.query();
    return departments;
}

const viewAllRoles = async (localHostData) => {
    const viewRoles = new ViewAllRoles(localHostData);
    const rolesTable = await viewRoles.query();
    return rolesTable;
}

const viewAllEmployees = async (localHostData) => {
    const viewEmployees = new ViewAllEmployees(localHostData);
    const employeesTable = await viewEmployees.query();
    return employeesTable;
}

const viewManagers = async (localHostData) => {
    const viewManagers = new ViewManagers(localHostData);
    const managersTable = await viewManagers.query();
    return managersTable;
}

const viewEmployeesByManager = async (localHostData) => {
    const managersTable = await viewManagers(localHostData);
    console.table(managersTable);

    const { managerID } = await inquirer.prompt(
        {
            type: 'input',
            name: 'managerID',
            message: 'Which manager would you like to view employees for? Use their employee ID:',
        }
    );

    const validManagerID = errorCheck(managersTable, 'Manager Id', parseInt(managerID))
    if (!validManagerID) {
        console.log('\x1b[41mPlease enter a valid manager ID.\x1b[0m');
        return viewEmployeesByManager(localHostData);
    }

    const employeesByManager = new ViewEmployeesByManager(localHostData, managerID);
    const employees = await employeesByManager.query();   
    return employees;
}

const viewCombinedSalaries = async (localHostData) => {
    let departments = await viewAllDepartments(localHostData);

    departments = departments.map(department => department['Department Name'])

    let department = await inquirer.prompt(
        {
            type: 'list',  
            name: 'department',
            message: 'Which department would you like to view combined salaries for?',
            choices: departments
        }
    );
    department = department.department;
    const viewCombinedSalaries = new ViewCombinedSalaries(localHostData, department);
    const combinedSalaries = await viewCombinedSalaries.query();
    return {combinedSalaries, department};
}


const addDepartment = async (localHostData) => {
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

const addRole = async (localHostData) => {
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
                message: 'What is the salary of the role you would like to add? (to the nearest thousand): $'
            }
        ]
    );

    if (isNaN(salary)) {
        console.log('Please enter a number.');
        return addRole(localHostData);
    }
    if (salary < 1000) {
        console.log('Please enter salary to the nearest thousand.');
        return addRole(localHostData);
    }

    role = role.charAt(0).toUpperCase() + role.slice(1);


    let departments = await viewAllDepartments(localHostData);
    departments = departments.map(department => department['Department Name'])

    const { department } = await inquirer.prompt(
        {
            type: 'list',
            name: 'department',
            message: 'What is the department you would like to add the role into?',
            choices: departments
        }
    );

    let department_id = await viewAllDepartments(localHostData);
    department_id = department_id.filter(departmentObj => departmentObj['Department Name'] === department);
    department_id = department_id[0]['Department Id'];

    const addNewRole = new AddRole(localHostData, role, salary, department_id);
    await addNewRole.query();
    return role;
}

const addEmployee = async (localHostData) => {
    
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
    
    let roles = await viewAllRoles(localHostData);
    roles = roles.map(role => role['Role Title'])

    const { role } = await inquirer.prompt(
        {
            type: 'list',
            name: 'role', 
            message: 'What is the role you would like to add the employee into?',
            choices: roles
        }
    );

    let role_id = await viewAllRoles(localHostData);
    role_id = role_id.filter(roleObj => roleObj['Role Title'] === role);
    role_id = role_id[0]['Role Id'];



    let managers = await viewManagers(localHostData);
    console.table(managers)

    const { manager_id } = await inquirer.prompt(
        {
            type: 'input',
            name: 'manager_id',
            message: 'What is the manager Id of the employee you would like to add? Refer to the table above.'
        }
    );

    const validManagerID = errorCheck(managers, 'Manager Id', parseInt(manager_id));
    if (!validManagerID) {
        console.log('Please enter a valid manager ID.');
        return addEmployee(localHostData);
    }

    const addNewEmployee = new AddEmployee(localHostData, first_name, last_name, role_id, manager_id);
    await addNewEmployee.query();
    return first_name + " " + last_name;
}

const updateEmployeeRole = async (localHostData) => {
    const employees = await viewAllEmployees(localHostData);
    console.table(employees);
    
    const { employee_id } = await inquirer.prompt(
        {
            type: 'input',
            name: 'employee_id',
            message: 'What is the id of the employee you would like to update? Refer to the table above:'
        }
    );
    
    const validEmployeeID = errorCheck(employees, 'Employee Id', parseInt(employee_id));
    if (!validEmployeeID) {
        console.log('Please enter a valid employee ID.');
        return updateEmployeeRole(localHostData);
    }

    let roles = await viewAllRoles(localHostData);
    roles = roles.map(role => role['Role Title'])

    const { role } = await inquirer.prompt(
        {
            type: 'list',
            name: 'role',
            message: 'What is the role you would like to update the employee into?',
            choices: roles
        }
    );

    let role_id = await viewAllRoles(localHostData);
    role_id = role_id.filter(roleObj => roleObj['Role Title'] === role);
    role_id = role_id[0]['Role Id'];

    const updateEmployeeRole = new UpdateEmployeeRole(localHostData, employee_id, role_id);
    await updateEmployeeRole.newUpdateQuery();

    const updatedEmployee = await updateEmployeeRole.query(localHostData);
    let employeeName = updatedEmployee[0]['First Name'] + " " + updatedEmployee[0]['Last Name'];
    return { employeeName, role };
}

const updateEmployeeManager = async (localHostData) => {
    const employees = await viewAllEmployees(localHostData);
    console.table(employees);

    const { employee_id } = await inquirer.prompt(
        {
            type: 'input',
            name: 'employee_id',
            message: 'What is the id of the employee you would like to update? Refer to the table above:'
        }
    );

    const validEmployeeID = errorCheck(employees, 'Employee Id', parseInt(employee_id));
    if (!validEmployeeID) {
        console.log('Please enter a valid employee ID.');
        return updateEmployeeManager(localHostData);
    }

    const managers = await viewManagers(localHostData);
    console.table(managers);

    const { manager_id } = await inquirer.prompt(
        {
            type: 'input',
            name: 'manager_id',
            message:"What is the id of the manager you'd like the employee to be managed by? Refer to the table above:"
        }
    );
    
    const validManagerID = errorCheck(managers, 'Manager Id', parseInt(manager_id));
    if (!validManagerID) {
        console.log('Please enter a valid manager ID.');
        return updateEmployeeManager(localHostData);
    }

    const updateEmployeeManager = new UpdateEmployeeManager(localHostData, employee_id, manager_id);
    await updateEmployeeManager.newUpdateQuery();
    const updatedEmployee = await updateEmployeeManager.query();
    let employeeName = updatedEmployee[0]['First Name'] + " " + updatedEmployee[0]['Last Name'];
    let employeeManager = updatedEmployee[0]['Manager Name'];
    return { employeeName, employeeManager };
}

const deleteEntry = async (localHostData, table) => {
    table = table.charAt(0).toLowerCase() + table.slice(1);
    try {
        console.log(table)
        let entry = ''
        let sql = ''
        switch(table) {
            case 'department':
            entry = await viewAllDepartments(localHostData);
            console.table(entry);
            sql = 'name, id';
            checkId = 'Department Id';
            break;
            case 'role':
            entry = await viewAllRoles(localHostData);
            console.table(entry);
            sql = 'title, id';
            checkId = 'Role Id';
            break;
            case 'employee':
            entry = await viewAllEmployees(localHostData);
            console.table(entry);
            sql = 'first_name, id, last_name';
            checkId = 'Employee Id';
            break;
        }
        
        const { id } = await inquirer.prompt(
            {
                type: 'input',
                name: 'id',
                message: 'What is the id of the table entry you would like to delete? Refer to the table above:'
            }
        );

        const validID = errorCheck(entry, checkId, parseInt(id));
        if (!validID) {
            console.log('Please enter a valid ID.');
            return deleteEntry(localHostData, table);
        }

        const deleteRow = new DeleteQuery(localHostData, sql, table, id);
        const deletedRow = await deleteRow.query();
        await deleteRow.newDeleteQuery();

        let name = Object.values(deletedRow[0])[0];
        const query_id = Object.values(deletedRow[0])[1];
        const last_name = Object.values(deletedRow[0])[2];

        if (table === 'employee') {
            name = name + " " + last_name;
        }


        return { name, query_id };

    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            console.log('\x1b[41mPlease remove all foreign key entries associated with this table before deleting.\x1b[0m');
            return deleteEntry(localHostData, table);
        } else {
            throw err;    
        }
    }    
}

module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees, viewManagers, viewEmployeesByManager, viewCombinedSalaries, addDepartment, addRole, addEmployee, updateEmployeeRole, updateEmployeeManager, deleteEntry };
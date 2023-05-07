const inquirer = require('inquirer');
const hostData = require('./hostData.json');
const init = require('./cli.js');
const {ViewAllDepartments, ViewAllRoles, ViewAllEmployees, AddDepartment, AddRole, ViewManagers, AddEmployee, DeleteDepartment} = require('./queries.js');


const localHostData = hostData[0];


const viewAllDepartments = async () => {
    const viewDepartments = new ViewAllDepartments(localHostData);
    await viewDepartments.dbConnection();
    const departments = await viewDepartments.dbQuery();
    return departments;
}

const viewAllRoles = async () => {
    const viewRoles = new ViewAllRoles(localHostData);
    await viewRoles.dbConnection();
    const roles = await viewRoles.dbQuery();
    return roles;
}

const viewAllEmployees = async () => {
    const viewEmployees = new ViewAllEmployees(localHostData);
    await viewEmployees.dbConnection();
    const employees = await viewEmployees.dbQuery();
    return employees;
}

module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees };
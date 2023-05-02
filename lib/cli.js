const inquirer = require('inquirer');
const path = require('path');
const promptQuestions = require('./promptQuestions');
const fs = require('fs');
const viewAllDepartments = require('./viewAllDepartments');

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

        switch (sqlDb.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            default:
                return;
        }

    
    
        }
    catch (err) {
        console.log(err);}
};

module.exports = init;
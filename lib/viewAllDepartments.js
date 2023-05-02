const init = require('./cli.js');
const db = require('../public/scripts/db.js');

const viewDepartments = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, departments) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(departments);
        init();
    });
}

module.exports = viewDepartments;
// model/userModel.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { addDepartment } = require('../controllers/NewUserConroller');

const userModel = {
  getRoleId: async (role) => {
    const query = 'SELECT Role_id FROM role WHERE name = ?';
    const [results] = await db.query(query, [role]);

    if (results.length === 0) {
      throw new Error('Invalid role');
    }

    return results[0].Role_id;
  },


getAllDepartment:async () => {
const query ='SELECT Dept_id, Dept_Name FROM department';
const [results] = await db.query(query);
return results; 

},
departmentExists:async (departmentName) => {
  const query = 'SELECT Dept_id FROM department WHERE Dept_Name = ?';
  const [results] = await db.query(query, [departmentName]);
  return results.length > 0; // Returns true if department exists

},
addDepartment:async (departmentName) => {
  const query = 'INSERT INTO department (Dept_Name) VALUES (?)';
  const [result] =  await db.query(query, [departmentName]);
  return result.insertId; // Return the ID of the newly inserted department
},

  createUser: async ({ name, email, password, roleId, verification_token ,department_id,dob}) => {
    const query = `
      INSERT INTO user (name, email, password, role_id, verified, verification_token, department, Dath_of_Birth) 
      VALUES (?, ?, ?, ?, 0, ?,?, ?)
    `;
    await db.query(query, [name, email, password, roleId, verification_token,department_id,dob]);
  },verifyUser: async (email) => {
    const query = `UPDATE user SET verified = 1, verification_token = NULL WHERE email = ?`;
    await db.query(query, [email]);
  },
  findByEmail: async (email) => {
    const query = 'SELECT * FROM user WHERE email = ?';
    const [results] = await db.query(query, [email]);
    return results[0]; // Return the first user found or undefined
  },  
  
  roleExists: async (roleName) => {
    const query = 'SELECT Role_id FROM role WHERE name = ?';
    const [results] = await db.query(query, [roleName]);
    return results.length > 0; // Returns true if role exists
  },
  addRole:async (roleName)=>{
    const query  ='INSERT INTO role (name) VALUES (?)';
    const [result] =await db.query(query,[roleName])
    return result.insertId
  }

};

module.exports = userModel;

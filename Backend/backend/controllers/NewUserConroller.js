// controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../model/NewUser');
const sendEmail = require('../config/mailer'); // Create this utility

const JWT_SECRET = 'your_secret_key';

exports.signup = async (req, res) => {
  const { name, email, password, role,department_id,dob } = req.body;

  if (!name || !email || !password || !role || !department_id || !dob) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const roleId = await userModel.getRoleId(role);
    const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

    await userModel.createUser({
      name,
      email,
      password: hashedPassword,
      roleId,
      verification_token: token,
      department_id,
      dob,
    });

    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
    await sendEmail(email, 'Verify your email', `Click to verify: ${verificationLink}`);

    res.status(201).json({ message: 'Signup successful. Please check your email to verify.' });
  } catch (err) {
    console.error('Error signing up user:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.verifyEmail = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    const user = await userModel.findByEmail(email);
    if (!user || user.verified) {
      return res.status(400).json({ message: 'Invalid or already verified token' });
    }

    await userModel.verifyUser(email);
    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    console.error('Email verification error:', err.message);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};




exports.addRole = async (req, res) => {
    try {
      const { roleName } = req.body; // Extract role name from request
  
      if (!roleName) {
        return res.status(400).json({ message: 'Role name is required' });
      }
  
      const roleExists = await userModel.roleExists(roleName); // Check if role already exists
      if (roleExists) {
        return res.status(400).json({ message: 'Role already exists' });
      }
  
      const roleId = await userModel.addRole(roleName); // Add new role to database
      res.status(201).json({ message: 'Role added successfully', roleId }); // Send success response
    } catch (err) {
      console.error('Error adding role:', err.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

exports.getDepartment = async (req, res) => {
  try {
    const departments = await userModel.getAllDepartment(); // Implement this function in model
    res.status(200).json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  exports.addDepartment = async (req, res) => {
    try {
        const { departmentName } = req.body; // Extract department name from request
  
        if (!departmentName) {
          return res.status(400).json({ message: 'Department name is required' });
        }
  
        const departmentExists = await userModel.departmentExists(departmentName); // Check if department already exists
        if (departmentExists) {
          return res.status(400).json({ message: 'Department already exists' });
        }
  
        const departmentId = await userModel.addDepartment(departmentName); // Add new department to database
        res.status(201).json({ message: 'Department added successfully', departmentId }); // Send success response
      } catch (err) {
        console.error('Error adding department:', err.message);
        res.status(500).json({ message: 'Internal server error' });
      }
  }
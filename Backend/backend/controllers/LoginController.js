const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { encryptGCM, decryptGCM } = require('../middleware/EncrytionAndDecryption');
const User = require('../model/LoginUserModel');
const JWT_SECRET = 'ebramha_token'; // Use env variable in real apps

// 
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.verified)
      return res.status(401).json({ message: 'Please verify your email first' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ Store user info in session
    req.session.user = {
  id: user.user_id,
  name: user.name,
  email: user.email,
  role: user.role_name
};

req.session.save(err => {
  if (err) {
    console.error('Session save error:', err);
    return res.status(500).json({ message: 'Session error' });
  }

  res.status(200).json({
    message: 'Login successful',
    user: {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role_name,
      role_id: user.role_id,
    }
  });
});


  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getMe = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  res.json({
    id: req.session.user.id,
    name: req.session.user.name,
    email: req.session.user.email,
    role_id: req.session.user.role_id,
    role: req.session.user.role,
  });
};

// exports.getMe = async (req, res) => {
//   try {
// console.log("req.user",req.user.userId);

//     const user = await User.findById(req.user.userId);
    
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({
//       id: user.user_id,
//       name: user.name,
//       email: user.email,
//       role: user.role_name,
//       role_id: user.role_id,
//     });
//   } catch (err) {
//     console.error('Error in getMe controller:', err);
//     res.status(500).json({ message: 'Internal error' });
//   }
// };
// exports.logout = (req, res) => {
//   res.clearCookie('token', {
//     httpOnly: true,
//     secure: false,     // use false if you're on localhost HTTP (not HTTPS)
//     sameSite: 'Lax'
//   });
//   res.json({ message: 'Logged out successfully' });

// }

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }

    res.clearCookie('session_id');
    res.json({ message: 'Logged out successfully' });
  });
};


const jwt = require('jsonwebtoken');
const JWT_SECRET = 'ebramha_token';
const { decryptGCM } =require('../middleware/EncrytionAndDecryption'); // Adjust the path as necessary

const verifyToken = (req, res, next) => {
  console.log("fffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  
  const token = req.cookies.token; // Read token from cookie

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token found' });
  }

  try {
     const decoded = jwt.verify(token, JWT_SECRET);

    // Decrypt the sensitive fields
    const decryptedUserId = decryptGCM(decoded.userId);
    const decryptedEmail = decryptGCM(decoded.email);
    const decryptedRoleId = decryptGCM(decoded.role_id);
    console.log("decryptedUserId",decryptedUserId);
    console.log("decryptedEmail",decryptedEmail); 
    console.log("decryptedRoleId",decryptedRoleId);
    

    // Attach decrypted data to req.user
    req.user = {
      userId: decryptedUserId,
      email: decryptedEmail,
      role_id: decryptedRoleId
    }; // Attach decoded token (userId, etc.)
    next();

  } catch (err) {
    console.error('Invalid token:', err);
    res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

module.exports = verifyToken;

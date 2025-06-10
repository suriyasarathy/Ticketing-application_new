const db = require("../config/db"); // your promiseDB

// Middleware to set session-level @user_id
const setUserContext = async (req, res, next) => {
  try {
    // 🔁 Use userId from decoded JWT
    const userId = req.user?.userId;

    if (!userId) return next(); // skip if user is not authenticated

    console.log("Setting MySQL session variable @user_id to:", userId);

    // Set session variable in MySQL
    const result = await db.query("SET @user_id = ?", [userId]);
    console.log("DB result:", result);  // Add this line
    
    next();
  } catch (err) {
    console.error("Failed to set @user_id:", err.message);
    res.status(500).json({ error: "Internal error setting user context" });
  }
};

module.exports = setUserContext;

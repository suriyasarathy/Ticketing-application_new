const User = require("../model/user");
const multer = require("multer");
const path = require("path");
const db = require("../config/db");
const fs = require("fs");
// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save uploads
  },
  filename: function (req, file, cb) {
    // Unique filename: userId + timestamp + extension
    const ext = path.extname(file.originalname);
    cb(null, req.body.id + "-" + Date.now() + ext);
  },
});

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.query.id; // Get ID from query parameter

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findUserById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const upload = multer({ storage });

exports.updateUserProfileWithImage = [
  upload.single("profileImage"), // 'profileImage' is the form field name
  async (req, res) => {
    try {
      const userId = req.body.id;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const existingUser = await User.findUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const name = req.body.name || existingUser.name;
      const aboutMe = req.body.aboutMe || existingUser.about_me;
      const dob = req.body.dob || existingUser.Date_of_Birth;
      let profileImage = existingUser.profile_image;

      if (req.file) {
        profileImage = `uploads/${req.file.filename}`;
      }

      await User.updateUserProfile(userId, name, aboutMe, profileImage,dob);

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

exports.removeProfileImage =  async (req, res) => {
  const userId = req.query.id; // ← changed from req.body.id

  if (!userId) return res.status(400).json({ message: "User ID is required" });

  try {
    // Get current image path from DB
    const [rows] = await db.execute("SELECT profile_image FROM user WHERE user_id = ?", [userId]);

    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const imagePath = rows[0].profile_image;

    if (imagePath) {
      const fullPath = path.join(__dirname, 'uploads', path.basename(imagePath));

      // Remove file from disk
      fs.unlink(fullPath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error("Error deleting file:", err);
        }
      });

      // Update DB to remove reference
      await db.execute("UPDATE user SET profile_image = NULL WHERE user_id = ?", [userId]);
    }

    res.json({ message: "Profile image removed successfully" });
  } catch (err) {
    console.error("Error removing profile image:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


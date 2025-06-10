const User = require('../model/user');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users' });
    }
};
exports.getAllUser= async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  exports.updateUser= async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
      await User.updateById(id, data);
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  exports.deleteUser= async (req, res) => {
    const { id } = req.params;

    try {
      await User.deleteById(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
exports.getuserDetial =async (req, res) => {
  const userId = req.params.id; // Get ID from URL parameter
  console.log("userId",userId);
   // Get ID from query parameter
  
    try {
      const user = await User.findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user); 
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  } 
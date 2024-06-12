const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const getUserProfile= async (req, res) => {
    try {
      const users = await User.find({ name: req.params.name });
      res.status(200).json({ users: users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const updateUserProfile= async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.userId, req.body);
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const deleteUser= async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


module.exports = {deleteUser,updateUserProfile,getUserProfile};

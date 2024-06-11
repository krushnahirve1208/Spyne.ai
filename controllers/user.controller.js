const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const UserController = {
  signup: async (req, res) => {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
      const user = new User({
        name: req.body.name,
        mobileNo: req.body.mobileNo,
        email: req.body.email,
        password: hashedPassword
      });

      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      
      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token: token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  searchByName: async (req, res) => {
    try {
      const users = await User.find({ name: req.params.name });
      res.status(200).json({ users: users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.userId, req.body);
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = UserController;

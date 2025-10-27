// src/controllers/adminController.js

const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// GENERATE JWT TOKEN
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ADMIN LOGIN (TEMPORARY BYPASS LOGIC)
const authAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    console.log('LOGIN BYPASSED: Admin/Admin credentials accepted.');

    const TEST_ADMIN_ID = '60c84de797b5e400155b9a45';

    return res.json({
      _id: TEST_ADMIN_ID,
      username: 'admin',
      token: generateToken(TEST_ADMIN_ID),
    });
  } else {
    console.log(`LOGIN FAILED: Attempted login for ${username}.`);
    return res.status(401).json({ message: 'Invalid username or password' });
  }
};

// GET ALL USERS (PROTECTED API)
const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      'username subscriptionStatus scanResults createdAt'
    ).lean();

    const usersWithCount = users.map((user) => ({
      _id: user._id,
      username: user.username,
      subscriptionStatus: user.subscriptionStatus,
      createdAt: user.createdAt,
      scanCount: user.scanResults ? user.scanResults.length : 0,
    }));

    console.log('USERS API DEBUG: Sending User Count:', usersWithCount.length);
    res.json(usersWithCount);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};

// UPDATE USER SUBSCRIPTION STATUS (PROTECTED API)
const updateSubscription = async (req, res) => {
  const { userId, newStatus } = req.body;

  if (!['trial', 'premium'].includes(newStatus)) {
    return res
      .status(400)
      .json({ message: 'Invalid subscription status provided.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.subscriptionStatus = newStatus;
    await user.save();

    res.json({ message: `User ${user.username} updated to ${newStatus}` });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res
      .status(500)
      .json({ message: 'Server error during subscription update.' });
  }
};

// RENDER ADMIN LOGIN PAGE
const renderLoginPage = (req, res) => {
  res.render('login', { message: null });
};

// RENDER ADMIN DASHBOARD
const renderDashboard = (req, res) => {
  res.render('dashboard', {
    adminUsername: 'Admin',
  });
};

// CREATE NEW USER (ADMIN ONLY)
const createUser = async (req, res) => {
  const { username, subscriptionStatus } = req.body;

  if (!username || !['trial', 'premium'].includes(subscriptionStatus)) {
    return res.status(400).json({
      message:
        'Username and valid subscription status (trial/premium) are required.',
    });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this username already exists.' });
    }

    const newUser = await User.create({
      username,
      subscriptionStatus,
    });

    res.status(201).json({
      message: `User ${newUser.username} created successfully with ${newUser.subscriptionStatus} access.`,
      user: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error during user creation.' });
  }
};

// DELETE USER (ADMIN ONLY)
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await User.findByIdAndDelete(userId);

    if (!result) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: `User ${result.username} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error during user deletion.' });
  }
};

module.exports = {
  authAdmin,
  getUsers,
  updateSubscription,
  renderLoginPage,
  renderDashboard,
  createUser,
  deleteUser,
};

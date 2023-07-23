const userService = require('../services/userService');

async function register(req, res) {
  const { username, password,email } = req.body;

  try {
    const result = await userService.registerUser(username, password,email);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.loginUser(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in user' });
  }
}

async function getUserLogs(req, res) {
  try {
    const userLogs = await userService.getUserLogs();
    res.json(userLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  register,
  login,
  getUserLogs,
};
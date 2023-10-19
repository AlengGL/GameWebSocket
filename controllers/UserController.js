var User = require("../models/users");
var Blacklist = require("../models/blacklist");
var { generateAuthToken, respondWithToken } = require('./jwtController');

/* register */
exports.registerUser = async (req, res) => {
    try {
      const { username, password, birthday } = req.body;
      const existingUser = await User.findOne({ username });
  
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      const newUser = new User({
        username,
        password, // 需要使用適當的加密方式
        birthday,
      });
  
      const savedUser = await newUser.save();
      return res.status(201).json(savedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
};

/* login */
exports.loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
      const existingUser = await User.findOne({ username, password });
  
      if (existingUser) {
        const token = generateAuthToken(username);
        const existingBlack = await Blacklist.findOne({ token });
  
        if (existingBlack) {
          return res.status(401).json({ error: 'Token revoked' });
        }
  
        return respondWithToken(res, token);
      } else {
        return res.status(401).json({ error: 'Authentication failed' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
};

/* logout */
exports.logoutUser = async (req, res) => {
    try {
      console.log(req.headers);
      const token = req.headers.authorization;
  
      const existingBlack = await Blacklist.findOne({ token });
  
      if (!existingBlack) {
        return res.status(200).json({ message: 'Already Logged out' });
      }
  
      const newBlacklist = new Blacklist({
        token,
      });
  
      const savedBlacklist = await newBlacklist.save();
  
      return res.status(200).json({ message: 'Logout successful', blacklist: savedBlacklist });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
};

/* get me */
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
  
      if (!user) {
        return res.status(404).json({ message: '使用者不存在' });
      }
  
      res.json({
        username: user.username,
        birthday: user.birthday,
        lastLoginDate: user.lastLoginDate,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '伺服器錯誤' });
    }
};
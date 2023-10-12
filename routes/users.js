var express = require('express');
var router = express.Router();
var User = require("../models/users");
var Blacklist = require("../models/blacklist");

/* register */
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, birthday } = req.body;
     // 檢查使用者是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // 使用者已存在，返回錯誤
      return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = new User({
      username,
      password, // 需要使用適當的加密方式
      birthday,
    });

    // 儲存新使用者到資料庫
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser); // 201 成功
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

/* Login */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // 檢查使用者是否已存在
    const existingUser = await User.findOne({ username, password });

    if (existingUser) {
      // 檢查token是否在黑名單中
      const token = generateAuthToken(username);
      const existingBlack = await Blacklist.findOne({ token });
      if (existingBlack) {
        return res.status(401).json({ error: 'Token revoked' });
      }

      return res.status(200).json({ token }); // 成功登入
    } else {
      // 使用者不存在
      return res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    // 處理其他錯誤
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* Logout */
router.post('/logout', async (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers.authorization;

    const existingBlack = await Blacklist.findOne({ token });
    if (existingBlack) {
      return res.status(200).json({ message: 'Already Logged out' });
    }
  
    // 加入黑名單
    const newBlacklist = new Blacklist({
      token,
    });
    const savedBlacklist = await newBlacklist.save();
  
    return res.status(200).json({ message: 'Logout successful' ,blacklist: savedBlacklist}); //成功登出
  } catch (error) {
    
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* JWT function */
function generateAuthToken(username) {
  const jwt = require('jsonwebtoken');
  const secretKey = 'your_secret_key'; // 記得使用安全的密鑰
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' }); // 這裡的 expiresIn 是設定過期時間

  return token;
}

module.exports = router;

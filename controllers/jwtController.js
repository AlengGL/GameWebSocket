// controllers/jwtController.js
const jwt = require('jsonwebtoken');

function respondWithToken(res, token) {
    res.json({
      access_token: token,
      token_type: 'bearer',
      expires_in: jwt.decode(token).exp * 1000 // 轉換成毫秒
    });
}

/* JWT function */
function generateAuthToken(username) {
    const secretKey = 'your_secret_key'; // 記得使用安全的密鑰
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' }); // 這裡的 expiresIn 是設定過期時間
  
    return token;
}

module.exports = { generateAuthToken, respondWithToken };

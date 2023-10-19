var jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  
  var token = req.header('Authorization');

  token = token.split(' ')[1];
  token = token.replace('Bearer ', '');
  
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, 'your_secret_key', (err, user) => {
    if (err) {
      // 可以在這裡加入更多具體的錯誤處理
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: 'Token verification failed' });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;

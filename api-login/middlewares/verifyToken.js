const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Token não fornecido');
  }

  jwt.verify(token, 'segredo', (err, decoded) => {
    if (err) {
      return res.status(403).send('Token inválido');
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;

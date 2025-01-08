const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); 

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(cors());

const getUsers = () => {
  const data = fs.readFileSync('users.json');
  return JSON.parse(data);
};

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

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email e senha são obrigatórios');
  }

  const users = getUsers();
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(401).send('Credenciais inválidas');
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).send('Credenciais inválidas');
    }

    const token = jwt.sign({ userId: user.id }, 'segredo', { expiresIn: '1h' });
    res.json({ token });
  });
});

app.get('/admin', verifyToken, (req, res) => {
  res.send(`Bem-vindo, admin! Seu ID é ${req.userId}`);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

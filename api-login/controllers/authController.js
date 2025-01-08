const express = require('express');
const bodyParser = require('body-parser');

const { login } = require('./controllers/authController');
const verifyToken = require('./middlewares/verifyToken');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/login', login);

app.get('/admin', verifyToken, (req, res) => {
  res.send(`Bem-vindo, admin! Seu ID é ${req.userId}`);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

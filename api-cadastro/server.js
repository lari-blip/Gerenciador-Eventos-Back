const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const getUsers = () => {
  try {
    const data = fs.readFileSync('users.json');
    return JSON.parse(data);
  } catch (err) {
    return [];  
  }
};

const saveUsers = (users) => {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send('Nome, email e senha são obrigatórios');
  }

  const users = getUsers();
  const userExists = users.find(user => user.email === email);

  if (userExists) {
    return res.status(400).send('Administrador já cadastrado');
  }

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);  
    const newUser = {
      id: users.length + 1,  
      nome,
      email,
      password: hashedPassword,  
    };

    users.push(newUser);
    saveUsers(users);  

    res.status(201).send('Administrador cadastrado com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao cadastrar administrador');
  }
});

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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

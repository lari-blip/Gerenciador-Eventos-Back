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

const getEventos = () => {
  try {
    const data = fs.readFileSync('eventos.json');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveEventos = (eventos) => {
  fs.writeFileSync('eventos.json', JSON.stringify(eventos, null, 2));
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

// Rota para cadastro de evento
app.post('/eventos', (req, res) => {
  const { nome_evento, data_evento, localizacao, imagem, adminId } = req.body;

  if (!nome_evento || !data_evento || !localizacao || !imagem || !adminId) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  const eventos = getEventos();

  const novoEvento = {
    id: eventos.length + 1,
    nome_evento,
    data_evento,
    localizacao,
    imagem,
    id_administrador: adminId,
  };

  eventos.push(novoEvento);
  saveEventos(eventos);

  res.status(201).json(novoEvento);
});

app.get('/eventos/:id_administrador', (req, res) => {
  const idAdministrador = parseInt(req.params.id_administrador, 10);
  const eventos = getEventos();
  const eventosFiltrados = eventos.filter(evento => evento.id_administrador === idAdministrador);

  if (eventosFiltrados.length === 0) {
    return res.status(404).json({ message: 'Nenhum evento encontrado para este administrador' });
  }

  res.status(200).json(eventosFiltrados);
});

app.put('/eventos/:eventoId', (req, res) => {
  const eventoId = parseInt(req.params.eventoId, 10);
  const { data_evento, localizacao } = req.body;

  if (!data_evento && !localizacao) {
    return res.status(400).json({ message: 'Pelo menos um campo (data_evento ou localizacao) deve ser fornecido' });
  }

  const eventos = getEventos();
  const eventoIndex = eventos.findIndex(evento => evento.id === eventoId);

  if (eventoIndex === -1) {
    return res.status(404).json({ message: 'Evento não encontrado' });
  }

  if (data_evento) {
    eventos[eventoIndex].data_evento = data_evento;
  }

  if (localizacao) {
    eventos[eventoIndex].localizacao = localizacao;
  }

  saveEventos(eventos);

  res.status(200).json(eventos[eventoIndex]);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

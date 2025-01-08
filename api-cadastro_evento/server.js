const express = require('express');
const cors = require('cors');  // Adicionando o CORS
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para permitir requisições de diferentes origens
app.use(cors());  // Permite CORS de qualquer origem
app.use(bodyParser.json());

// Dados simulados para eventos (geralmente isso viria de um banco de dados)
let eventos = [
  { id: 1, nome_evento: 'Evento 1', data_evento: '2025-01-10', id_administrador: 1 },
  { id: 2, nome_evento: 'Evento 2', data_evento: '2025-02-15', id_administrador: 1 },
  { id: 3, nome_evento: 'Evento 3', data_evento: '2025-03-05', id_administrador: 2 },
];

// Rota para cadastrar um novo evento
app.post('/eventos', (req, res) => {
  const { nome_evento, data_evento, localizacao, imagem, adminId } = req.body;

  if (!nome_evento || !data_evento || !localizacao || !imagem || !adminId) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  const novoEvento = {
    id: eventos.length + 1,
    nome_evento,
    data_evento,
    localizacao,
    imagem,
    id_administrador: adminId,
  };

  eventos.push(novoEvento);
  res.status(201).json(novoEvento);
});

// Rota para listar eventos de um administrador específico
app.get('/eventos/:id_administrador', (req, res) => {
  const idAdministrador = parseInt(req.params.id_administrador, 10);
  const eventosFiltrados = eventos.filter(evento => evento.id_administrador === idAdministrador);

  if (eventosFiltrados.length === 0) {
    return res.status(404).json({ message: 'Nenhum evento encontrado para este administrador' });
  }

  res.status(200).json(eventosFiltrados);
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

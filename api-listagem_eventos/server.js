const express = require('express');
const fs = require('fs');  // Usado para ler o arquivo JSON

const app = express();
const port = 3000;

app.use(express.json());

// Armazenamento em memória para os eventos
let eventos = [
  { id: 1, nome_evento: 'Evento 1', data_evento: '2025-01-10', id_administrador: 1 },
  { id: 2, nome_evento: 'Evento 2', data_evento: '2025-02-15', id_administrador: 1 },
  { id: 3, nome_evento: 'Evento 3', data_evento: '2025-03-05', id_administrador: 2 },
];

// Rota para listar eventos por ID do administrador usando memória
app.get('/eventos/:id_administrador', (req, res) => {
  const idAdministrador = parseInt(req.params.id_administrador, 10);

  // Filtra os eventos pelo id_administrador
  const eventosFiltrados = eventos.filter(evento => evento.id_administrador === idAdministrador);

  if (eventosFiltrados.length === 0) {
    return res.status(404).json({ message: 'Nenhum evento encontrado para este administrador' });
  }

  // Retorna os eventos encontrados
  res.status(200).json(eventosFiltrados);
});

// Rota para listar eventos por ID do administrador usando JSON
app.get('/eventos-json/:id_administrador', (req, res) => {
  const idAdministrador = parseInt(req.params.id_administrador, 10);

  // Lê o arquivo JSON contendo os eventos
  fs.readFile('db/eventos.json', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao ler o arquivo de eventos', error: err.message });
    }

    // Converte o conteúdo do arquivo para um objeto JS
    const eventos = JSON.parse(data);

    // Filtra os eventos pelo id_administrador
    const eventosFiltrados = eventos.filter(evento => evento.id_administrador === idAdministrador);

    if (eventosFiltrados.length === 0) {
      return res.status(404).json({ message: 'Nenhum evento encontrado para este administrador' });
    }

    // Retorna os eventos encontrados
    res.status(200).json(eventosFiltrados);
  });
});

// Iniciando o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

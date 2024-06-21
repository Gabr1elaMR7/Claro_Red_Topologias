// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/diagrams', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Definir el esquema del nodo
const nodeSchema = new mongoose.Schema({
  key: String,
  color: String
});

const Node = mongoose.model('Node', nodeSchema);

// Ruta para obtener todos los nodos
app.get('/nodes', async (req, res) => {
  const nodes = await Node.find();
  res.json(nodes);
});

// Ruta para buscar un nodo específico y sus conexiones
app.get('/nodes/search', async (req, res) => {
  const searchKey = req.query.key;
  
  if (!searchKey) {
    return res.status(400).send({ message: 'Se requiere un parámetro de búsqueda' });
  }

  // Encontrar el nodo por la clave
  const node = await Node.findOne({ key: searchKey });
  
  if (!node) {
    return res.status(404).send({ message: 'Equipo no encontrado' });
  }

  // Definir manualmente las conexiones basadas en la clave del nodo
  let links = [];
  switch (searchKey) {
    case 'Alpha':
      links = [
        { from: 'Alpha', to: 'Beta' },
        { from: 'Alpha', to: 'Gamma' }
      ];
      break;
    case 'Beta':
      links = [
        { from: 'Beta', to: 'Delta' }
      ];
      break;
    case 'Gamma':
      links = [
        { from: 'Gamma', to: 'Delta' }
      ];
      break;
    // Agrega más casos según tus necesidades
    default:
      links = []; // Si no hay conexiones predefinidas, usa una lista vacía
  }

  // Encontrar los nodos conectados
  const connectedNodesKeys = Array.from(new Set(links.flatMap(link => [link.from, link.to])));
  const connectedNodes = await Node.find({ key: { $in: connectedNodesKeys } });

  res.json({ node, connectedNodes, links });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

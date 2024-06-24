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
  try {
    const nodes = await Node.find();
    res.json(nodes);
  } catch (error) {
    console.error('Error fetching nodes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ruta para buscar un nodo por clave y obtener sus conexiones
app.get('/nodes/search', async (req, res) => {
  const { key } = req.query;

  try {
    // Buscar el nodo principal por clave
    const node = await Node.findOne({ key }).exec();

    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    
    // En este ejemplo, se asumirá que las conexiones son estáticas.
    const connections = [
      { from: 'Alpha', to: 'Beta' },
      { from: 'Alpha', to: 'Gamma' },
      { from: 'Beta', to: 'Delta' },
      { from: 'Gamma', to: 'Delta' }
    ];

    const connectedNodesKeys = connections
      .filter(conn => conn.from === key || conn.to === key)
      .map(conn => (conn.from === key ? conn.to : conn.from));

    const connectedNodes = await Node.find({
      key: { $in: connectedNodesKeys }
    }).exec();

    const result = {
      node: node,
      connectedNodes: connectedNodes,
      connections: connections.filter(conn => connectedNodesKeys.includes(conn.from) || connectedNodesKeys.includes(conn.to))
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching nodes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

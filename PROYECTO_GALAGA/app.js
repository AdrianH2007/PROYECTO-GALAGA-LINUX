const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const PORT = 3000;

// Configuración de MongoDB (Usando la base de datos de tu práctica)
const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase'; // [cite: 336]
let db;

app.use(express.json());

// Servir de forma estática los archivos del juego (HTML, CSS, JS del cliente)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener el puntaje más alto desde MongoDB
app.get('/api/highscore', async (req, res) => {
    try {
        const scoreData = await db.collection('scores').findOne({}, { sort: { score: -1 } });
        res.json({ highscore: scoreData ? scoreData.score : 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para guardar una nueva puntuación
app.post('/api/highscore', async (req, res) => {
    try {
        const { score } = req.body;
        await db.collection('scores').insertOne({ score: parseInt(score), date: new Date() });
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Conectar a MongoDB e iniciar servidor
MongoClient.connect(url)
    .then(client => {
        console.log('Conectado exitosamente a MongoDB');
        db = client.db(dbName);
        app.listen(PORT, () => {
            console.log(`Aplicación Galaga escuchando en http://localhost:${PORT}`); // 
        });
    })
    .catch(error => console.error('Error al conectar a MongoDB:', error));
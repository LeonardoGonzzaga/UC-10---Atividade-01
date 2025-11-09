const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
// Allow CORS from the frontend origin set in FRONTEND_URL (or allow all if not set)
const frontendOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/jogos', require('./routes/jogos'));
app.use('/api/usuarios', require('./routes/usuarios'));

const PORT = process.env.PORT || 3000;
// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Export app for testing if needed
module.exports = app;
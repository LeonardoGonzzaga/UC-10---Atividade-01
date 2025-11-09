const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        // Permitir requisições sem origem (como apps mobile ou Postman)
        if (!origin) return callback(null, true);
        
        // Lista de origens permitidas
        const allowedOrigins = [
            'https://estouroecommerce.vercel.app',
            'http://localhost:4200'
        ];
        
        // Verificar se a origem está na lista ou se é um subdomínio do Vercel
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
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
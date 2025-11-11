const mongoose = require('mongoose');

// Define o esquema para um Comentário
const comentarioSchema = new mongoose.Schema({
    // Referência ao Jogo ao qual este comentário pertence.
    // O tipo ObjectId é usado para vincular coleções.
    jogoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jogo', // Assumindo que seu modelo de jogo se chama 'Jogo'
        required: true
    },
    // Nome do usuário que fez o comentário (pode ser ajustado para userId em um app real)
    usuario: { 
        type: String,
        required: true,
        trim: true
    },
    // O conteúdo do comentário
    texto: {
        type: String,
        required: true,
        maxlength: 500 // Limite de caracteres para evitar textos muito longos
    },
    // Data de criação, definida automaticamente
    dataCriacao: {
        type: Date,
        default: Date.now
    }
}, {
    // Adiciona timestamps de updatedAt e createdAt automaticamente
    timestamps: true 
});

module.exports = mongoose.model('Comentario', comentarioSchema);
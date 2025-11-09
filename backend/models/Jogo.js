const mongoose = require('mongoose');

const jogoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do jogo é obrigatório']
    },
    descricao: {
        type: String,
        required: [true, 'A descrição do jogo é obrigatória']
    },
    preco: {
        type: Number,
        required: [true, 'O preço do jogo é obrigatório'],
        min: [0, 'O preço não pode ser negativo']
    },
    imagemUrl: {
        type: String,
        required: [true, 'A URL da imagem é obrigatória']
    }
}, {
    timestamps: true,
    strict: false // Permite campos extras
});

module.exports = mongoose.model('Jogo', jogoSchema);
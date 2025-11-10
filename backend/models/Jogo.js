const mongoose = require('mongoose');

const requisitosSchema = new mongoose.Schema({
    sistema: { type: String, default: '' },
    processador: { type: String, default: '' },
    memoria: { type: String, default: '' },
    placaVideo: { type: String, default: '' },
    armazenamento: { type: String, default: '' }
}, { _id: false });

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
    },
    genero: { type: String, default: '' },
    publisher: { type: String, default: '' },
    desenvolvedora: { type: String, default: '' },
    requisitosMinimos: { type: requisitosSchema, default: () => ({}) },
    dataLancamento: { type: Date },
    sobre: { type: String, default: '' },
    idiomas: { type: [String], default: [] },
    avaliacoesPositivas: { type: Number, default: 0 },
    avaliacoesNegativas: { type: Number, default: 0 }
}, {
    timestamps: true,
    strict: false // Mantém compatibilidade com campos extras existentes
});

module.exports = mongoose.model('Jogo', jogoSchema);
const express = require('express');
const router = express.Router();
const Jogo = require('../models/Jogo');

// Listar todos os jogos
router.get('/', async (req, res) => {
    try {
        const jogos = await Jogo.find();
        res.json(jogos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obter um jogo específico
router.get('/:id', async (req, res) => {
    try {
        const jogo = await Jogo.findById(req.params.id);
        if (jogo) {
            res.json(jogo);
        } else {
            res.status(404).json({ message: 'Jogo não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Criar um novo jogo
router.post('/', async (req, res) => {
    const jogo = new Jogo({
        nome: req.body.nome,
        descricao: req.body.descricao,
        preco: req.body.preco,
        imagemUrl: req.body.imagemUrl,
        genero: req.body.genero || '',
        publisher: req.body.publisher || '',
        desenvolvedora: req.body.desenvolvedora || '',
        requisitosMinimos: req.body.requisitosMinimos || {},
        dataLancamento: req.body.dataLancamento ? new Date(req.body.dataLancamento) : undefined,
        sobre: req.body.sobre || '',
        idiomas: Array.isArray(req.body.idiomas) ? req.body.idiomas : (req.body.idiomas ? [req.body.idiomas] : []),
        avaliacoesPositivas: req.body.avaliacoesPositivas || 0,
        avaliacoesNegativas: req.body.avaliacoesNegativas || 0
    });

    try {
        console.log('POST /api/jogos payload.sobre:', req.body.sobre);
        const novoJogo = await jogo.save();
        res.status(201).json(novoJogo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Atualizar um jogo
router.put('/:id', async (req, res) => {
    try {
        const jogo = await Jogo.findById(req.params.id);
        if (!jogo) {
            return res.status(404).json({ message: 'Jogo não encontrado' });
        }

        // Campos básicos
        jogo.nome = req.body.nome || jogo.nome;
        jogo.descricao = req.body.descricao || jogo.descricao;
        jogo.preco = (req.body.preco !== undefined) ? req.body.preco : jogo.preco;
        jogo.imagemUrl = req.body.imagemUrl || jogo.imagemUrl;

    // Novos campos
        jogo.genero = req.body.genero || jogo.genero;
        jogo.publisher = req.body.publisher || jogo.publisher;
        jogo.desenvolvedora = req.body.desenvolvedora || jogo.desenvolvedora;
    jogo.sobre = (req.body.sobre !== undefined) ? req.body.sobre : jogo.sobre;
        jogo.requisitosMinimos = req.body.requisitosMinimos || jogo.requisitosMinimos;
        jogo.dataLancamento = req.body.dataLancamento ? new Date(req.body.dataLancamento) : jogo.dataLancamento;
        jogo.idiomas = Array.isArray(req.body.idiomas) ? req.body.idiomas : (req.body.idiomas ? [req.body.idiomas] : jogo.idiomas);

    console.log('PUT /api/jogos/:id payload.sobre:', req.body.sobre);
    const jogoAtualizado = await jogo.save();
        res.json(jogoAtualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Deletar um jogo
router.delete('/:id', async (req, res) => {
    try {
        const jogo = await Jogo.findByIdAndDelete(req.params.id);
        if (!jogo) {
            return res.status(404).json({ message: 'Jogo não encontrado' });
        }
        res.json({ message: 'Jogo removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Avaliação do jogo (positivo/negativo)
router.post('/:id/avaliacao', async (req, res) => {
    const positiva = req.body.positiva;
    try {
        const jogo = await Jogo.findById(req.params.id);
        if (!jogo) return res.status(404).json({ message: 'Jogo não encontrado' });

        if (positiva) {
            jogo.avaliacoesPositivas = (jogo.avaliacoesPositivas || 0) + 1;
        } else {
            jogo.avaliacoesNegativas = (jogo.avaliacoesNegativas || 0) + 1;
        }

        const atualizado = await jogo.save();
        res.json(atualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
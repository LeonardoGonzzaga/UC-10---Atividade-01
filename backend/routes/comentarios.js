const express = require('express');
const router = express.Router();
const Jogo = require('../models/Jogo');
const Comentario = require('../models/comentario');
 
router.post('/', async (req, res) => {
    const { jogoId, usuario, texto } = req.body;
    
    // Validação básica de entrada
    if (!jogoId || !usuario || !texto) {
        return res.status(400).json({ message: 'jogoId, usuario e texto são obrigatórios.' });
    }

    try {
        // 1. Opcional: Verifica se o Jogo existe antes de salvar o comentário
        const jogoExiste = await Jogo.findById(jogoId);
        if (!jogoExiste) {
            return res.status(404).json({ message: 'Jogo associado não encontrado.' });
        }

        const novoComentario = new Comentario({ jogoId, usuario, texto });
        const comentarioSalvo = await novoComentario.save();
        
        res.status(201).json(comentarioSalvo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rota 2: GET /api/comentarios/:jogoId
// Lista todos os comentários para um jogo específico
router.get('/:jogoId', async (req, res) => {
    try {
        // Encontra comentários pelo jogoId, ordenando do mais recente para o mais antigo
        const comentarios = await Comentario.find({ jogoId: req.params.jogoId })
            .sort({ dataCriacao: -1 }); // -1 para ordem decrescente (mais recente primeiro)
            
        res.json(comentarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota 3: PUT /api/comentarios/update/:id
// Atualiza um comentário específico pelo seu ID (útil para edição)
router.put('/update/:id', async (req, res) => {
    try {
        const comentario = await Comentario.findById(req.params.id);
        if (!comentario) {
            return res.status(404).json({ message: 'Comentário não encontrado' });
        }

        // Apenas permite a atualização do texto
        comentario.texto = req.body.texto || comentario.texto;

        const comentarioAtualizado = await comentario.save();
        res.json(comentarioAtualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rota 4: DELETE /api/comentarios/:id
// Deleta um comentário específico pelo seu ID
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await Comentario.findByIdAndDelete(req.params.id);
        if (!resultado) {
            return res.status(404).json({ message: 'Comentário não encontrado' });
        }
        res.json({ message: 'Comentário removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Verificar se email já existe (usado pelo frontend durante o cadastro)
router.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.find({ email });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota de login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // Aqui você deve implementar uma comparação segura de senha
        // Por enquanto, faremos uma comparação simples
        if (senha !== usuario.senha) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        res.json({
            id: usuario._id,
            nome: usuario.nome,
            email: usuario.email
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Criar um novo usuário
router.post('/register', async (req, res) => {
    try {
        const usuarioExistente = await Usuario.findOne({ email: req.body.email });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        const usuario = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha // Em produção, você deve hash a senha
        });

        const novoUsuario = await usuario.save();
        res.status(201).json({
            id: novoUsuario._id,
            nome: novoUsuario.nome,
            email: novoUsuario.email
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
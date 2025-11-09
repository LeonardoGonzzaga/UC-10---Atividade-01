const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const Jogo = require('./models/Jogo');
const Usuario = require('./models/Usuario');

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

async function migrarDados() {
    try {
        // Ler dados do db.json
        console.log('Lendo arquivo db.json...');
        const dados = JSON.parse(fs.readFileSync('../db.json', 'utf8'));

        // Migrar jogos
        if (dados.jogos && dados.jogos.length > 0) {
            console.log('Iniciando migração de jogos...');
            console.log(`Encontrados ${dados.jogos.length} jogos para migrar`);
            
            try {
                await Jogo.deleteMany({});
                console.log('Coleção de jogos limpa com sucesso');
            } catch (deleteError) {
                console.error('Erro ao limpar coleção de jogos:', deleteError);
            }
            
            // Remover o campo id e validar cada jogo
            const jogosParaMigrar = dados.jogos.map(jogo => {
                const { id, ...jogoSemId } = jogo;
                console.log('Preparando jogo para migração:', {
                    nome: jogoSemId.nome,
                    preco: jogoSemId.preco,
                    temDescricao: !!jogoSemId.descricao,
                    temImagemUrl: !!jogoSemId.imagemUrl
                });
                return jogoSemId;
            });

            // Tentar inserir um jogo por vez para identificar problemas específicos
            for (const jogo of jogosParaMigrar) {
                try {
                    const novoJogo = new Jogo(jogo);
                    await novoJogo.save();
                    console.log(`Jogo "${jogo.nome}" migrado com sucesso`);
                } catch (jogoError) {
                    console.error(`Erro ao migrar jogo "${jogo.nome}":`, jogoError.message);
                    if (jogoError.errors) {
                        Object.keys(jogoError.errors).forEach(key => {
                            console.error(`- Campo ${key}:`, jogoError.errors[key].message);
                        });
                    }
                }
            }
        }

        // Migrar usuários
        if (dados.usuarios && dados.usuarios.length > 0) {
            console.log('Iniciando migração de usuários...');
            await Usuario.deleteMany({});
            
            const usuariosParaMigrar = dados.usuarios.map(usuario => {
                const { id, ...usuarioSemId } = usuario;
                return usuarioSemId;
            });

            await Usuario.insertMany(usuariosParaMigrar);
            console.log(`${usuariosParaMigrar.length} usuários migrados com sucesso!`);
        }

        console.log('Migração concluída!');
        
        // Verificar resultado final
        const jogosCount = await Jogo.countDocuments();
        const usuariosCount = await Usuario.countDocuments();
        console.log(`\nResultado final:`);
        console.log(`- Jogos no banco: ${jogosCount}`);
        console.log(`- Usuários no banco: ${usuariosCount}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Erro durante a migração:', error);
        console.error('Detalhes do erro:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Erro no campo ${key}:`, error.errors[key].message);
            });
        }
        process.exit(1);
    }
}

migrarDados();

migrarDados();
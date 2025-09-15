const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Importar o vetor de usuários para verificação
// NOTA: Em uma arquitetura maior, a lógica de busca de usuário estaria em um "service"
const users = require('./users.router').users; // Gambiarra para pegar o vetor exportado

// Chave secreta para assinar o JWT. Em um app real, use variáveis de ambiente!
const JWT_SECRET = 'sua-chave-super-secreta-e-longa-12345';

// ROTA POST /login - Autentica um usuário e retorna um token
router.post('/login', (req, res) => {
    const { login, senha } = req.body;

    // 1. Validar se login e senha foram enviados
    if (!login || !senha) {
        return res.status(400).json({ mensagem: "Login e senha são obrigatórios." });
    }

    // 2. Encontrar o usuário no nosso "banco de dados"
    const user = users.find(u => u.login === login);

    if (!user) {
        return res.status(401).json({ mensagem: "Credenciais inválidas." }); // 401 Unauthorized
    }

    // 3. Verificar se a senha está correta
    // Em um app real, aqui você usaria bcrypt.compare(senha, user.senha)
    if (user.senha !== senha) {
        return res.status(401).json({ mensagem: "Credenciais inválidas." });
    }

    // 4. Se tudo estiver correto, gerar o Token JWT
    const payload = {
        userId: user.id,
        login: user.login
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expira em 1 hora

    // 5. Enviar o token para o cliente
    res.status(200).json({ token: token });
});

module.exports = router;
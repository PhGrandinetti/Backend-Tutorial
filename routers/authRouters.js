const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


const users = require('./usersRouters').users; 

const JWT_SECRET = 'sua-chave-super-secreta-e-longa-12345';

router.post('/login', async (req, res) => {
    const { login, senha } = req.body;

    if (!login || !senha) {
        return res.status(400).json({ mensagem: "Login e senha são obrigatórios." });
    }


    const user = users.find(u => u.login === login);
    
    if (!user) {
        return res.status(401).json({ mensagem: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
        return res.status(401).json({ mensagem: "Credenciais inválidas." });
    }

    const payload = {
        userId: user.id,
        login: user.login
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 

    res.status(200).json({ token: token });
});

module.exports = router;
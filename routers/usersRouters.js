const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

let users = [
    { id: 1, login: "ada.lovelace", senha: "$2b$10$nEfjrkBIUk4Ck0lvxjiFaOvoZW5QPhqyw90cJA9ETVeBOAhmKwT8G", email: "ada@email.com", nome: "Ada Lovelace" },
    { id: 2, login: "grace.hopper", senha: "$2b$10$Z1BhcSfhnp9GX8kdiZ9mauPM0A79XjiUIV.ctmeQYKbkxRBXMFD0W", email: "grace@email.com", nome: "Grace Hopper" }
];
let proximoId = 3;

router.get('/', (req,res) =>{
    res.status(200).json(users)
})

router.get('/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const user = users.find(p => p.id === id)

    if(!user){
        res.status(404).json({mensagem: 'Usuário não encontrado'})
    }

    res.status(200).json(user)
})

router.post('/', async (req, res) => { // <-- 2. TRANSFORMAR a função em async
    try {
        const { login, senha, email, nome } = req.body;

        // 3. GERAR O HASH DA SENHA
        const saltRounds = 10; // Fator de custo
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        const novoUsuario = {
        id: proximoId++,
        login,
        senha: senhaHash, // <-- 4. SALVAR O HASH, não a senha original
        email,
        nome
        };

        users.push(novoUsuario);
        res.status(201).json({ id: novoUsuario.id, login, email, nome });

    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao criar usuário." });
    }
});

router.put('/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const index = users.findIndex(p => p.id === id)

    if(index === -1){
        return res.status(404).json({mensagem: 'Usuário não encontrado'})
    }

    const userAtualizado ={
        id: id,
        login: req.body.login,
        senha: req.body.senha,
        email: req.body.email,
        nome: req.body.nome
    };

    users[index] = userAtualizado
    res.status(200).json(userAtualizado)
})

router.patch('/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const index = users.findIndex(p => p.id === id)

    if(index === -1){
        return res.status(404).json({mensagem: 'Usuário não encontrado'})
    }
    const userOriginal = users[index]
    const userAtualizado = {
        id: userOriginal.id,
        login: req.body.login ||userOriginal.login,
        senha: req.body.senha ||userOriginal.senha,
        email: req.body.email ||userOriginal.email,
        nome: req.body.nome || userOriginal.nome
    }
    
    users[index] = userAtualizado
    res.status(200).json(userAtualizado)
})

router.delete('/:id', (req,res) =>{
    const id = parseInt(req.params.id)
    const index = users.findIndex(p => p.id === id)
    
    if(index === -1){
        return res.status(404).json({mensagem: 'Usuário não encontrado!'})
    }

    users.splice(index, 1)
    res.status(204).send()
})

module.exports = router
module.exports.users = users
const express = require('express')
const { route } = require('./petsRouter')
const router = express.Router()

let users = [
    { id: 1, login: "ada.lovelace", senha: "123", email: "ada@email.com", nome: "Ada Lovelace" },
    { id: 2, login: "grace.hopper", senha: "abc", email: "grace@email.com", nome: "Grace Hopper" }
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

router.post('/', (req,res) => {
    const novoUser = {
        id: proximoId++,
        login: req.body.login,
        senha: req.body.senha,
        email: req.body.email,
        nome: req.body.nome
    }

    users.push(novoUser)
    res.status(201).json(novoUser)
})

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
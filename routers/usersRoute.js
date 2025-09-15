const express = require('express')
const { route } = require('./petsRouter')
const router = express.Router()

let users = [
    {id:1, nome:'Caio Patrick', email: 'caiop@gmail.com', contato: '(84) 9xxxx-xxxx', senha:'123456'},
    {id:2, nome:'Emily Dantas', email: 'emilyd@gmail.com', contato: '(11) 9xxxx-xxxx', senha: 'a1524b'}
]

let pId = 3

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
        id: pId++,
        nome: req.body.nome,
        email: req.body.email,
        contato: req.body.contato,
        senha: req.body.senha
    }

    users.push(novoUser)
    res.status(201).json(novoUser)
})

router.put('/:id', (req,res) => {
    const id = req.params.id
    const index = users.findIndex(p => p.id === id)

    if(index === -1){
        return res.status(404).json({mensagem: 'Usuário não encontrado'})
    }

    const userAtualizado ={
        id: id,
        nome: req.body.nome,
        email: req.body.email,
        contato: req.body.contato,
        senha: req.body.senha
    };

    users[index] = userAtualizado
    res.status(200).json(userAtualizado)
})

router.patch('/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const index = findIndex(p => p.id === id)

    if(index === -1){
        return res.status(404).json({mensagem: 'Usuário não encontrado'})
    }
    const userOriginal = users[index]
    const userAtualizado = {
        id: userOriginal.id,
        nome: req.body.nome || userOriginal.nome,
        email: req.body.email || userOriginal.email,
        contato: req.body.contato || userOriginal.contato,
        senha: req.body.senha || userOriginal.senha
    }
    
    users[index] = userAtualizado
    res.status(200).json(userAtualizado)
})

router.delete('/:id', (req,res) =>{
    const id = parseInt(req.params.id)
    const index = findIndex(p=>p.id===id)
    
    if(index === -1){
        return res.status(404).json({mensagem: 'Usuário não encontrado!'})
    }

    users.splice(index, 1)
    res.status(204).send()
})

module.exports = router
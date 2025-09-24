const {Router} = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

//importando middleware de verificação de papel
const {checkRole} = require('../middleware/permission.middleware')
const authMiddleware = require('../middleware/auth.middleware') // middleware de autorização

const router = Router()

let users = [
    {   
        id: 1,
        nome: "Admin User",
        email: "admin@example.com",
        senha: '$2a$10$Y.ds.L9C5pUXB4LKOaFO9elLnPX/8.fl22LgWf/oQ8i.G2hFzHhie', // hash para 'admin123'
        role: 'admin' // Papel de administrador
    }
];                                            
let proximoId = 2;

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

router.post('/', authMiddleware, checkRole('admin'),  async (req, res) => { 
    try {
        const { nome, email, senha } = req.body;

        if(!nome || !email || !senha){
            return res.status(400).json({mensagem: 'Nome, email e senha são obrigatórios.'})
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const role = req.body.role || 'user'

        const novoUsuario = {
        id: proximoId++,
        nome,
        email, 
        senha: senhaHash,
        role: role
        };

        users.push(novoUsuario);
        const userResponse = {...novoUsuario}
        delete userResponse.senha

        res.status(201).json(userResponse);

    } catch (error) {
        console.error(error)
        res.status(500).json({ mensagem: "Erro ao criar usuário." });
    }
});

//rota de login
router.post('/login', async (req,res) => {
    
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
module.exports.users = users
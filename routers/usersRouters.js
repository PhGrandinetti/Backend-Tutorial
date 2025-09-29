const {Router} = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


//importando middleware de verificação de papel
const {checkRole} = require('../middleware/permission.middleware')
const authMiddleware = require('../middleware/auth.middleware') // middleware de autorização
const secret = 'sua-chave-super-secreta-e-longa-12345';

const router = Router()

let users = [
    {   
        id: 1,
        nome: "Admin User",
        email: "admin@example.com",
        senha: '$2b$10$E9E6lvmIglzj/8XWLAhAD.D9EJRVSNg3aOoLu3Em/Qtj5aZcSKy1a', // hash para 'admin123'
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

//criando usuário
router.post('/', authMiddleware, checkRole('admin'),  async (req, res) => { 
    try {
        console.log('entrou no post')
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
    try{
        const {email, senha} = req.body
        const user = users.find(u => u.email == email) // checagem de email
        
        if(!user){
            return res.status(401).json({mensagem: "Credenciais inválidas."})
        }

        const senhaMatch = await bcrypt.compare(senha, user.senha) // checagem de senha

        if(!senhaMatch){
            return res.status(401).json({mensagem: 'Credenciais inválidas.'})
        }

        //colocando role no JWT
        const payload = {
            id: user.id,
            nome: user.nome,
            role: user.role
        };

        const token = jwt.sign (
            payload,
            secret,
            {expiresIn: '1h'}
        )

        res.status(200).json({mensagem: 'Login bem-sucedido!', token})
    } catch (error) {
        console.error(error)
        res.status(500).json({menssagem: 'Erro ao processar a requisição.'})
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
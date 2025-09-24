const {Router} = require('express')
const router = Router()

//funções de vlaidação
const {body, param, validationResult} = require('express-validator')

//banco de dados em memória 
let pets = [
    {id:1, especie: 'cão', raca: 'pastor-alemão', nome: 'Rex'},
    {id:2, expecie: 'gato', raca: 'siamês', nome: 'Miau'}
]
let proximoId = 3

//middleware de validaçao -- para evitar de criar em todas as rotas
const validateRequest = (req,res,next) => {
    
    //array de erros
    const erros = validationResult(req)

    //checa se tem erros
    if(!erros.isEmpty()){
        //retorna status 400(bad request) junto com as lista dos erros que ocorreu
        return res.status(400).json({erros: erros.array() })
    }

    //caso não exista erros ele chama a proxima requisição
    next()
}

//definição das regra pq aqui não é baderna

//regra de novo pet
const petCreationRules = () => {
    return [
        body('especie')
            .isString().withMessage('A espécie deve ser um texto')
            .notEmpty().withMessage('Espécie deve ser preenchida'),
        
        body('raca')
            .isString().withMessage('A raça deve ser um texto')
            .notEmpty().withMessage('Raça deve ser preenchida'),

        body('nome')
            .isString().withMessage('O nome deve ser um texto')
            .notEmpty().withMessage('Nome deve ser preenchido')
            .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres')
    ]
}

//regra de pet que mudou de nome
const petUpdateRules = () => {
    return [
        body('especie').optional().isString().withMessage('A especie deve ser um texto'),
        body('raca').optional().isString().withMessage('A raca deve ser texto'),
        body('nome').optional().isString().isLength({min:3}).withMessage('O nome deve ser texto e com min de 3 caracteres')
    ]
}

//regra do id
const petIdRules = () => {
    return [
        param('id').isInt({min:1}).withMessage('O id deve ser um inteiro positivo')
    ]
}

//rotas CRUD
router.get('/', (req,res) => {
    res.status(200).json(pets)
})

router.get('/:id', petIdRules(), validateRequest, (req,res) => {
    const id = parseInt(req.params.id)
    const pet = pets.find(p => p.id === id)

    if(!pet){
        return res.status(404).json({mensagem: 'Pet não encontrado!'})
    }
    res.status(200).json(pet)
})

router.post('/', petCreationRules(), validateRequest, (req,res) => {
    const { especie, raca, nome } = req.body

    const novoPet = {id:proximoId++, especie, raca, nome}
    pets.push(novoPet)
    res.status(201).json({novoPet})
}) 

router.put('/:id',petIdRules(), petCreationRules(), validateRequest, (req, res) => {
    const id = parseInt(req.params.id);
    const index = pets.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: "Pet não encontrado!" });
    }

    const { especie, raca, nome} = req.body
    const petAtualizado = {id, especie, raca, nome}

    pets[index] = petAtualizado;
    res.status(200).json(petAtualizado);

});

router.patch('/pets/:id', petIdRules(), petUpdateRules(), validateRequest, (req, res) => {
    const id = parseInt(req.params.id);
    const index = pets.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: "Pet não encontrado!" });
    }

    const pet = pets[index]
    const {especie, raca, nome} = req.body
    
    if (especie) pet.especie = especie
    if (raca) pet.raca = raca
    if (nome) pet.nome = nome
    
    res.status(200).json(petAtualizado);
});

router.delete('/pets/:id',petIdRules(), validateRequest, (req, res) => {
    const id = parseInt(req.params.id);
    const index = pets.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: "Pet não encontrado!" });
    }
    
    pets.splice(index, 1);
    res.status(204).send();

});

module.exports = router;
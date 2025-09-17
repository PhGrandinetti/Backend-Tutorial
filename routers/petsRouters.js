const express = require('express')
const router = express.Router()


let pets = [
    {id:1, especie: 'cão', raca: 'pastor-alemão', nome: 'Rex'},
    {id:2, expecie: 'gato', raca: 'siamês', nome: 'Miau'}
]
let proximoId = 3

router.get('/', (req,res) => {
    res.status(200).json(pets)
})

router.get('/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const pet = pets.find(p => p.id === id)

    if(!pet){
        return res.status(404).json({mensagem: 'Pet não encontrado!'})
    }
    res.status(200).json(pet)
})

router.post('/', (req,res) => {
    const novoPet = {
        id: proximoId++,
        especie: req.body.especie,
        raca: req.body.raca,
        nome: req.body.nome
    }

    pets.push(novoPet)
    res.status(201).json({novoPet})
}) 

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pets.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: "Pet não encontrado!" });
    }

    const petAtualizado = {
        id: id,
        especie: req.body.especie,
        raca: req.body.raca,
        nome: req.body.nome
    };

    pets[index] = petAtualizado;
    res.status(200).json(petAtualizado);

});

router.patch('/pets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pets.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: "Pet não encontrado!" });
    }

    const petOriginal = pets[index];
    const petAtualizado = {
        id: petOriginal.id,
        especie: req.body.especie || petOriginal.especie,
        raca: req.body.raca || petOriginal.raca,
        nome: req.body.nome || petOriginal.nome
    };

    pets[index] = petAtualizado;
    res.status(200).json(petAtualizado);
});

router.delete('/pets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pets.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: "Pet não encontrado!" });
    }
    
    pets.splice(index, 1);
    res.status(204).send();

});

module.exports = router;
const express = require('express')
const app = express()
const PORTA = 3000

const petsRouter = require('./routers/petsRouter')
const usersRouter = require('./routers/usersRoute')

app.use(express.json());
app.use((req, res, next) => {
 console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
 next(); // Chama o próximo middleware ou rota
});

app.use('/api/pets', petsRouter)
app.use('/api/users', usersRouter)

app.use((req, res, next) => {
 res.status(404).json({ mensagem: "A rota solicitada não existe." });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`)
})
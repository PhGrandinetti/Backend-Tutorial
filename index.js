const express = require('express')
const app = express()
const PORTA = 3000

const authRouter = require('./routers/authRouters')
const petsRouter = require('./routers/petsRouters')
const usersRouter = require('./routers/usersRouters')
const authMiddleware = require('./middleware/auth.middleware')

app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/pets', authMiddleware, petsRouter)

app.use((req, res, next) => {
    res.status(404).json({ mensagem: "A rota solicitada não existe." });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`)
})
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sua-chave-super-secreta-e-longa-12345';

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: "Token não fornecido." });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ mensagem: "Erro no formato do token." });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ mensagem: "Token mal formatado." });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensagem: "Token inválido ou expirado." });
        }

        req.userId = decoded.userId;
        
        next();
    });
}

module.exports = authMiddleware

const checkRole = (requiredRole) => {
    return (req,res,next) => {
        const user = req.user
        if (!user || user.role !== requiredRole) {
            console.log(user)
            return res.status(403).json({mensagem: 'Acesso negado. Permissões insuficientes.'}) 
        }
        next()
    }
}
module.exports = {checkRole}
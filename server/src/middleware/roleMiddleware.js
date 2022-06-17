import jwt from 'jsonwebtoken';

export default (roles) => {
    return (req, res, next) => {
        try {
            const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }
            const {role: userRoles} = jwt.verify(token, process.env.JWT_SECRET)
            let hasRole = false
            console.log(`hasRole: ${userRoles}`)
            console.log(`hasRole: ${roles}`)
            userRoles.forEach(role => {
                console.log(role)
                if (roles.includes(role)) {
                    hasRole = true
                }
            })
            if (!hasRole) {
                console.log(`hasRole: ${hasRole}`)
                return res.status(403).json({message: "У вас нет доступа"})
            }
        } catch (error) {
            console.log(error)
            return res.status(403).json({message: "У вас нет доступа"})
        }  
        next(); 
    }
}
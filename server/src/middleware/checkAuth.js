import jwt from 'jsonwebtoken';
export default ( req, res, next ) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if(token){
        try {
            const decode  = jwt. verify(token, process.env.JWT_SECRET);
            req.userId = decode.id;
            req.userRole = decode.role;
        } catch (error) {
            return res.status(403).json({message:'Forbidden'});
        }
    }else{
        return res.status(403).json({message:'Forbidden'});
    }
    next();
}
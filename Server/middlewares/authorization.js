import jwt from 'jsonwebtoken';


export default function authorization(req, res, next){
    const token = req.header("Authorization");
    if(!token){
        return res.json({msg : "Access Denied", success: false});
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.id;
        next();
    } catch (error) {
        return res.json({msg : "Invalid Token", success: false});
    }
}   
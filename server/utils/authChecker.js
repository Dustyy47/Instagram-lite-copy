import jwt from "jsonwebtoken";

export const getId = (req, res, next)=>{
    try{
        const token = (req.headers.authorization || '').split(' ')[1];
        if(!token)
        {
            req.userId = null;
            next();
            return;
        }
        const payload = jwt.verify(token,process.env.SECRET);
        req.userId = payload.userId;
        next();
    }catch(e){
        console.log(e);
        res.status(500).json({message:"Что-то пошло не так, попробуйте позже..."});
    }
}


export const checkAuth = (req,res,next) => {
    try{
        if(!req.userId){
            res.status(400).json("Необходимо авторизироваться!");
        }
        next();
    }catch(e){
        console.log(e);
        res.status(500).json({message:"Что-то пошло не так, попробуйте позже..."});
    }
}
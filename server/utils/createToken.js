import jwt from "jsonwebtoken";

export const createToken = (nickName,id) => {
   return jwt.sign({
        userId: id,
        nickName: nickName,
    }, process.env.SECRET, {expiresIn: '7d'});
}
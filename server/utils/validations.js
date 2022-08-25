import {body, validationResult} from 'express-validator'

export const registrationValidations = [
    body('email','Неверный формат почты').isEmail(),
    body('password','Длина пароля должна быть от 6 до 25').isLength({min:6,max:25}),
    body('fullName','Длина имени должна быть от 3 до 35 символов').isLength({min:3,max:35})
]

export const addPostValidations = [
    body('title','Заголовок не может быть пустым!').isLength({min:3})
]

export const checkValidation = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors.array().map(e=>({
            message:e.msg
        })));
    }
    next();
}
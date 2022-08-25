import bcrypt from "bcrypt";
import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import path from "path";
import {__dirname} from "../start.js";

class AuthController {
    async register(req, res) {
        try {
            const {email, password, fullName} = req.body;
            const {avatarImage} = req.files;
            const avatarName = Date.now() + '--' + avatarImage.name;
            avatarImage.mv(path.resolve(__dirname,'images/avatars',avatarName))

            const candidate = await UserModel.findOne({email});
            if (candidate)
                return res.status(400).json({message: "Такой email занят"});
            const passwordHash = await bcrypt.hash(password, 10);
            const user = await UserModel.create({email, password: passwordHash, fullName,avatarUrl : avatarName});
            const token = jwt.sign({
                userId: user._id
            }, process.env.SECRET, {expiresIn: '7d'});
            res.json(token);
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'});
        }

    }

    async login(req, res) {
        try {
            const {email, password} = req.body;
            const user = await UserModel.findOne({email});
            if (!user) {
                return res.status(404).json({message: "Неверный логин или пароль"});
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(404).json({message: "Неверный логин или пароль"});
            }
            const token = jwt.sign({
                userId: user._id
            }, process.env.SECRET, {expiresIn: '7d'});
            res.json(token);
        }catch(e){
            console.log(e);
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'});
        }
    }

}

export default new AuthController();
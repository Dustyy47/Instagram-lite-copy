import UserModel from "../Models/UserModel.js";
import PostModel from "../Models/PostModel.js";
import path from "path";
import {__dirname} from "../utils/directoryVariables.js";
import mongoose from "mongoose";

class ProfileController {

    // profileId may be in two existing formats - /:id or /:nickName , like /123ASfs67dfSgsS or /dustee
    async getProfileData(req, res){
        try{
            const profileId = req.params.id; // id of profile what user are trying to get
            const userId = req.userId; // id of user who trying to get another user profile
            const isUserPage = profileId === userId;
            const isUserAuth = !!userId;
            const isIdValid = mongoose.Types.ObjectId.isValid(profileId);
            let profileOwner = null;
            if(isIdValid)
                profileOwner = await UserModel.findById(profileId);
            if(!profileOwner){
                profileOwner = await UserModel.findOne({nickName:profileId}) // check is profileId a nickName
                console.log(profileOwner);
                if(!profileOwner)
                    return res.status(404).json({message:"Такого пользователя не существует"})
            }
            const {email, fullName,avatarUrl,nickName} = profileOwner;
            const posts = await PostModel.find({postedBy: profileOwner._id});
            res.json({profileInfo : {email, fullName,avatarUrl,nickName,isUserPage,isUserAuth},posts});
        }catch(e){
            console.log(e);
            res.status(500).json({message:"Что-то пошло не так, попробуйте позже..."});
        }
    }

    async addPost(req,res){
        try{
            const userId = req.userId;
            const {title} = req.body;
            const {img} = req.files;
            const fileName = Date.now() + '--' + img.name;
            const types = ["jpg","jpeg","png"];
            if(types.indexOf(fileName.split('.').pop()) === -1){
                return res.status(400).json({message:"Неверный формат файла"});
            }
            await img.mv(path.resolve(__dirname, '..', 'images', fileName));

            const post = await PostModel.create({title , postedBy : userId , imageUrl : fileName});
            res.json(post);
        }catch(e){
            console.log(e);
            res.status(500).json({message:"Что-то пошло не так, попробуйте позже..."});
        }
    }

    async deletePost(req,res){
        try{
            const postId = req.params.id;
            const userId = req.userId;
            const post = await PostModel.findById(postId);
            if(!post)
            {
                return res.status(404).json({message:"Такого поста не существует"});
            }
            if(post.postedBy.toString() !== userId){
                return res.status(400).json({message: "У вас нет доступа"});
            }
            await post.remove();

            res.json({message:"Пост был удалён!"});
        }catch(e){
            console.log(e);
            res.status(500).json({message:"Что-то пошло не так, попробуйте позже..."});
        }
    }
}

export default new ProfileController()
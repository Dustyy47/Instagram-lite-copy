import mongoose from "mongoose";
import PostModel from "../Models/PostModel.js";
import UserModel from "../Models/UserModel.js";

// Convert all id formats to single (nickName to Id)
export const validateParamsId = async (req, res, next)=>{
    try{
        const profileId = req.params.id; // id of profile what user are trying to get
        let paramsId = profileId;
        const isNicknameInParams = !mongoose.Types.ObjectId.isValid(profileId); // if true, it is a nickName format
        if(isNicknameInParams){
            const candidate = await UserModel.findOne({nickName:profileId});
            paramsId = candidate._id.toString();
        }
        req.paramsId = paramsId;
        next();
    }catch(e){
        console.log(e);
        res.status(500).json({message:"Что-то пошло не так, попробуйте позже..."});
        next();
    }

}
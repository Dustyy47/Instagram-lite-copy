import mongoose from "mongoose";
import PostModel from "../Models/PostModel.js";
import UserModel from "../Models/UserModel.js";

// Convert all id formats to single (nickName to Id)
export const validateParamsId = async (req, res, next)=>{
    try{
        const profileId = req.params.id; // id of profile what user are trying to get
        const candidate = await UserModel.findOne({nickName:profileId});
        if(candidate !== null){
            req.validProfileID = candidate?._id.toString();
        }
        next();
    }catch(e){
        console.log(e);
        res.status(500).json({message:"Что-то пошло не так, попробуйте позже..."});
    }

}
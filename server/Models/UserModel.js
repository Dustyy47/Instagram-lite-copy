import mongoose from "mongoose"
const {Schema,model} = mongoose;
const UserModel = new Schema({
        email: {type: String, unique: true, required: true},
        fullName: {type: String, required: true},
        password: {type: String, required: true},
        nickName: {type:String,requires: true},
        avatarUrl: String
    }
)

export default model('User', UserModel)
import mongoose from "mongoose"
const {Schema,model} = mongoose;
const UserModel = new Schema({
        email: {type: String, unique: true, required: true},
        fullName: {type: String, required: true},
        password: {type: String, required: true},
        nickName: {type:String,requires: true},
        likedPosts:[ {type:Schema.Types.ObjectId,ref:'Post',default:[]} ],
        subscribers:[ {type:Schema.Types.ObjectId,ref:'User',default:[]} ],
        subscribes:[ {type:Schema.Types.ObjectId,ref:'User',default:[]} ],
        conversations:[{type:Schema.Types.ObjectId,ref:'Conversation'}],
        avatarUrl: String
    }
)

export default model('User', UserModel)
import mongoose from "mongoose"

const {Schema, model} = mongoose;

const MessageModel = new Schema({
        text : {type:String , required:true},
        author: {type:Schema.Types.ObjectId,ref:'User',required: true},
        conversation:{type:Schema.Types.ObjectId,ref:'Conversation'}
    },
    {
        timestamps:true,
    }
)

export default model('Message', MessageModel)
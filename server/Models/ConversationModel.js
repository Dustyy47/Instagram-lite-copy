import mongoose from "mongoose"

const {Schema, model} = mongoose;

const ConversationModel = new Schema({
        companions : [{type:Schema.Types.ObjectId,ref:'User',required:true}],
        messages  : [{type:Schema.Types.ObjectId,ref:'Message'}],
    },
)

export default model('Conversation', ConversationModel)
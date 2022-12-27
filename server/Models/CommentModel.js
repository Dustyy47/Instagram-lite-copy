import mongoose from "mongoose"

const {Schema, model} = mongoose;

const CommentModel = new Schema({
        text : {type:String , required:true},
        author: {type:Schema.Types.ObjectId,ref:'User',required: true},
        post: {type:Schema.Types.ObjectId,ref:'Post',required:true}
    },
    {
        timestamps:true,
    }
)

export default model('Comment', CommentModel)
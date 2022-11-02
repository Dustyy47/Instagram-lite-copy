import mongoose from "mongoose"

const {Schema, model} = mongoose;

const PostModel = new Schema({
        title: {type: String, required: true},
        description : {type : String, defaultValue : ""},
        likes: [ {type: Schema.Types.ObjectId, ref: 'User',} ],
        postedBy: {type: Schema.Types.ObjectId, ref: 'User'},
        imageUrl: String
    }
)

export default model('Post', PostModel)
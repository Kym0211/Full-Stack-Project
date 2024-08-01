import mongoose,{Schema, model} from "mongoose";

const likesSchema = new Schema({
    comment: {
        type: mongoose.Types.ObjectId,
        ref: "comments"
    },
    video: {
        type: mongoose.Types.ObjectId,
        ref: "videos"
    },
    likedBy: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    tweet: {
        type: mongoose.Types.ObjectId,
        ref: "tweets"
    },
})

export const Like = model("Like", likesSchema)
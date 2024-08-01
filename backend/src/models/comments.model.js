import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    video: {
        type: mongoose.Types.ObjectId,
        ref: "videos"
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: true })

export const Comment = model("Comment", commentSchema)
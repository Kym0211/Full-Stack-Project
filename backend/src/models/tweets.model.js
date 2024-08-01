import mongoose, { Schema, model } from "mongoose";

const tweetsSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: true })

export const Tweets = model("Tweet", tweetsSchema)
import mongoose, {isValidObjectId} from "mongoose";
import {Like} from "../models/likes.model.js"
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const user = req.user;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    };
    const like = await Like.findOne({video: videoId});
    if(like){
        await like.deleteOne();
        return res.status(200).json(new ApiResponse(200, "Like removed"))
    }
    const VideoLike = await Like.create({
        video: videoId,
        likedBy: user._id
    })

    res.status(200).json(new ApiResponse(200, VideoLike))
});

const toggleCommentLike = asyncHandler(async(req,res) => {
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Comment Id is invalid")
    }
    const {_id} = req.user;
    
    const like = await Like.findOne({comment: commentId});
    if(like){
        await like.deleteOne();
        return res.status(200).json(new ApiResponse(200, "Like removed"))
    }

    const commentLike = await Like.create({
        comment: commentId,
        likedBy: _id
    })

    return res.status(200).json(new ApiResponse(200, commentLike))
})
const toggleTweetLike = asyncHandler(async(req,res) => {
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Tweet Id is invalid")
    }
    const {_id} = req.user;
    
    const like = await Like.findOne({tweet: tweetId});
    if(like){
        await like.deleteOne();
        return res.status(200).json(new ApiResponse(200, "Like removed"))
    }

    const TweetLike = await Like.create({
        comment: tweetId,
        likedBy: _id
    })

    return res.status(200).json(new ApiResponse(200, TweetLike))
})

const getLikedVideos = asyncHandler(async (req,res) => {
    const user = req.user;
    console.log(user)

    // const likedVideos = await Like.find({likedBy: user._id}).populate("video");
    const likedVideos = await Like.find({likedBy: user._id})

    // console.log(likedVideos)

    return res.status(200).json(new ApiResponse(200, {likedVideos}))
})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}
import mongoose, {isValidObjectId} from "mongoose";
import {Like} from "../models/likes.model.js";
import {Video} from "../models/video.model.js";
import {Comment} from "../models/comments.model.js";
import {Tweets} from "../models/tweets.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Video Id is invalid")
    }
    const {_id} = req.user;
    const like = await Like.findOne({video: videoId});
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    if(like){
        await like.deleteOne();
        video.likes -= 1;
        await video.save();
        return res.status(200).json(new ApiResponse(200, "Like removed"))
    }
    video.likes += 1;
    await video.save();
    const videoLike = await Like.create({
        video: videoId,
        likedBy: _id
    })
    return res.status(200).json(new ApiResponse(200, videoLike))
})

const toggleCommentLike = asyncHandler(async(req,res) => {
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Comment Id is invalid")
    }
    const {_id} = req.user;
    const comment = await Comment.findById(commentId);
    const like = await Like.findOne({comment: commentId});
    if(like){
        await like.deleteOne();
        comment.likes -= 1;
        await comment.save();
        return res.status(200).json(new ApiResponse(200, "Like removed"))
    }

    const commentLike = await Like.create({
        comment: commentId,
        likedBy: _id
    })
    comment.likes += 1;
    await comment.save();

    return res.status(200).json(new ApiResponse(200, commentLike))
})

const toggleTweetLike = asyncHandler(async(req,res) => {
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Tweet Id is invalid")
    }
    const {_id} = req.user;
    const tweet = await Tweets.findById(tweetId);
    const like = await Like.findOne({tweet: tweetId});
    if(like){
        await like.deleteOne();
        tweet.likes -= 1;
        await tweet.save();
        return res.status(200).json(new ApiResponse(200, "Like removed"))
    }

    const TweetLike = await Like.create({
        comment: tweetId,
        likedBy: _id
    })
    tweet.likes += 1;
    await tweet.save();

    return res.status(200).json(new ApiResponse(200, TweetLike))
})

const getLikedVideos = asyncHandler(async (req,res) => {
    const user = req.user;

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
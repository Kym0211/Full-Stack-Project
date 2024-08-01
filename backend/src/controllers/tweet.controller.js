import mongoose, { isValidObjectId} from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const user = req.user;
    
    if (!content) {
        return next(new ApiError(400, "Content is required"));
    }
    
    const tweet = new Tweet({
        content,
        owner: user._id,
    });
    
    await tweet.save();
    const createdTweet = await Tweet.findById(tweet._id)
    if(!createdTweet){
        throw new ApiError(500, "Tweet not created");
    }

    return res.status(201).json(new ApiResponse(201,"Tweet Created Successfully", createdTweet));
});

const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User Id");
    }
    const tweets = await Tweet.find({ owner: userId });
    if(!tweets){
        throw new ApiError(404, "No Tweets found");
    }
    return res.status(200).json(new ApiResponse(200, "Tweets found", tweets));
})

const updateTweet = asyncHandler(async (req, res) => {
    const tweetId = req.params.tweetId;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet Id");
    }
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }
    const { content } = req.body;
    if (!content) {
        throw new ApiError(400, "Content is required");
    }
    tweet.content = content;
    await tweet.save();
    return res.status(200).json(new ApiResponse(200, "Tweet Updated Successfully", tweet));
})

const deleteTweet = asyncHandler(async (req, res) => {
    const tweetId = req.params.tweetId;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet Id");
    }
    const tweet = await Tweet.findByIdAndDelete(tweetId);
    const deletedTweet = await Tweet.findById(tweetId);
    if(!tweet || deletedTweet){
        throw new ApiError(404, "Tweet not found or not deleted");
    }
    return res.status(200).json(new ApiResponse(200, "Tweet Deleted Successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
import mongoose,{ isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }

    const comments = await Comment.find({ video: videoId }).populate("user", "username profilePicture");
    return res.status(200).json(new ApiResponse(200, "Comments found", comments));
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }

    const comment = new Comment({
        content,
        video: videoId,
        user: userId
    });
    await comment.save();
    return res.status(201).json(new ApiResponse(201, "Comment added", comment));
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id");
    }

    const comment = await Comment.findOne({ _id: commentId, user: userId });
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }

    comment.content = content;
    await comment.save();
    return res.status(200).json(new ApiResponse(200, "Comment updated", comment));
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.user;
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id");
    }

    const comment = await Comment.findOne({ _id: commentId, user: userId });
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }

    await comment.remove();
    return res.status(200).json(new ApiResponse(200, "Comment deleted"));
})

export { getVideoComments, addComment, updateComment, deleteComment };
import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/likes.model.js";

const getChannelStatus = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if(!isValidObjectId(_id)){
        throw new ApiError(400, "Invalid user id");
    }

    const totalViews = await Video.aggregate([
        {
            $match: { owner:new mongoose.Types.ObjectId(_id) }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ]);

    const totalSubscribers = await Subscription.countDocuments({ channel: _id });

    const totalVideos = await Video.countDocuments({ owner: _id });

    const totalLikes = await Like.aggregate([
        {
            $match: { video: { $in: (await Video.find({ owner: _id })).map(video => video._id) } }
        },
        {
            $group: {
                _id: null,
                totalLikes: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                totalLikes: 1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, "Channel status found", { totalViews: totalViews[0]?.totalViews || 0, totalSubscribers, totalVideos, totalLikes }));
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if(!isValidObjectId(_id)){
        throw new ApiError(400, "Invalid user id");
    }

    const videos = await Video.find({ owner: _id });
    if(!videos){
        return res.status(404).json(new ApiResponse(404, "No videos found"));
    }
    return res.status(200).json(new ApiResponse(200, "Videos found", videos));
})

export { getChannelStatus, getChannelVideos };

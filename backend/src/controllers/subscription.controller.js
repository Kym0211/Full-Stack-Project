import mongoose, {isValidObjectId} from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import {Apiresponse} from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async(req,res) => {
    const {channelId} = req.params;
    if(!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel id");

    const channel = await Subscription.findOne({channel: channelId, subscriber: req.user._id});
    if(channel){
        await channel.deleteOne();
        return Apiresponse(res, 200, "Unsubscribed successfully", null)
    }
    await Subscription.create({channel: channelId, subscriber: req.user._id});
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    try {
        const subscribers = await Subscription.aggregate([
            {
                $match: {
                    channel: mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    as: "subscriber"
                }
            },
            {
                $unwind: "$subscriber"  // Unwind if you want a flat list of subscribers
            },
            {
                $project: {
                    _id: 0,
                    subscriber: 1 // This will project only the subscriber field
                }
            }
        ]);

        res.status(200).json(new Apiresponse(200, "Subscribers fetched successfully", subscribers));
    } catch (error) {
        console.error(error);
        res.status(500).json(new Apiresponse(500, "Internal server error"));
    }
});

const getSubscibedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    if(!isValidObjectId(subscriberId)) throw new ApiError(400, "Invalid subscriber id");

    try {
        const channels = await Subscription.aggregate([
            {
                $match: {
                    subscriber: mongoose.Types.ObjectId(subscriberId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "channel"
                }
            },
            {
                $unwind: "$channel"
            },
            {
                $project: {
                    _id: 0,
                    channel: 1
                }
            }
        ]);

        res.status(200).json(new Apiresponse(200, "Channels fetched successfully", channels));
    } catch (error) {
        console.error(error);
        res.status(500).json(new Apiresponse(500, "Internal server error"));
    }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscibedChannels };
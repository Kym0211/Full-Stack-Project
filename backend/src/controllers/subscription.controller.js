import mongoose, {isValidObjectId} from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import Apiresponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async(req,res) => {
    const {channelId} = req.params;
    if(!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel id");

    const channel = await Subscription.findOne({channel: channelId, subscriber: req.user._id});
    if(channel){
        await channel.deleteOne();
        return res.status(200).json(new Apiresponse(200, "Subscription removed"));
    }
    await Subscription.create({channel: channelId, subscriber: req.user._id});
    res.status(201).json(new Apiresponse(201, "Subscription added"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    
    if (!mongoose.isValidObjectId(_id)) {
        throw new ApiError(400, "Invalid channel id");
    }

    try {
        const subscribers = await Subscription.aggregate([
            {
                $match: {
                    channel:new mongoose.Types.ObjectId(_id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    as: "subscriber",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                email: 1,
                                avatar: 1
                            }
                        }
                    ]
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

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!mongoose.isValidObjectId(_id)) throw new ApiError(400, "Invalid subscriber id");

    try {
        const channels = await Subscription.aggregate([
            {
                $match: {
                    subscriber: new mongoose.Types.ObjectId(_id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "channel",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                email: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$channel" // Flatten the channel array
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "channel._id",
                    foreignField: "channel",
                    as: "subscriberCount"
                }
            },
            {
                $addFields: {
                    subscriberCount: { $size: "$subscriberCount" }
                }
            },
            {
                $lookup: {
                    from: "videos",
                    let: { channelId: "$channel._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$owner", "$$channelId"]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                thumbnail: 1,
                                views: 1,
                                createdAt: 1,
                                duration: 1
                            }
                        },
                        {
                            $sort: { createdAt: -1 } // Sort by newest first
                        },
                        {
                            $limit: 2 // Limit to the 2 most recent videos
                        }
                    ],
                    as: "videos"
                }
            },
            {
                $project: {
                    _id: 0,
                    channel: 1,
                    subscriberCount: 1,
                    videos: 1
                }
            }
        ]);

        res.status(200).json(new Apiresponse(200, "Channels and their videos fetched successfully", channels));
    } catch (error) {
        console.error(error);
        res.status(500).json(new Apiresponse(500, "Internal server error"));
    }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
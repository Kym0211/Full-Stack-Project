import mongoose, {isValidObjectId, modelNames, mongo} from "mongoose"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType, userId } = req.query
    const parsedLimit = parseInt(limit)
    const pageskip = (page-1)*parsedLimit;
    const sortStage = {}
    sortStage[sortBy] = sortType === 'asc' ? 1: -1;

    const allVideo = await Video.aggregate([
        {
            $match: {
                isPublished: true,
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerResults",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner_details: {
                    $arrayElemAt: ["$ownerResults", 0],
                }
            }
        },
        {
            $sort: sortStage
        },
        {
            $skip: pageskip
        },
        {
            $limit: parsedLimit
        },
        {
            $project: {
                ownerResult: 0
            }
        },
    ])
    // const allVideo = await Video.find({isPublished: true}).sort(sortStage).skip(pageskip).limit(parsedLimit)
    
    res.status(201).json(new ApiResponse(201, "success", allVideo))

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    const { _id: userId } = req.user
    if(!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoFileLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if(!videoFileLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video file and thumbnail are required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!videoFile || !thumbnail) {
        throw new ApiError(500, "Failed to upload video file or thumbnail")
    }

    const duration = parseFloat(Math.floor(videoFile.duration / 60) + "." + (Math.floor(videoFile.duration % 60)))

    const video = await Video.create({
        videoFile: videoFile.secure_url,
        thumbnail: thumbnail.secure_url,
        title,
        description,
        duration,
        owner: userId,
    })

    const createdVideo = await Video.findById(video._id)
    if(!createdVideo) {
        throw new ApiError(500, "Failed to create video")
    }

    return res.status(201).json(new ApiResponse(201, "Video uploaded successfully",{createdVideo}))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerResults",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner_details: {
                    $arrayElemAt: ["$ownerResults", 0],
                }
            }
        },
        {
            $project: {
                ownerResult: 0
            }
        },
    ])
    if(!video) {
        return res.status(404).json(new ApiResponse(404, "Video not found", {}))
    }
    return res.status(200).json(new ApiResponse(200, "Video found", {video}))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }
    if(!req.user._id.equals(video.owner)){
        throw new ApiError(403, "You are not authorized to update this video")
    }
    const { title, description } = req.body
    if(!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }
    video.title = title
    video.description = description
    const thumbnailLocalPath = req.file?.path
    if(thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if(!thumbnail) {
            throw new ApiError(500, "Failed to upload thumbnail")
        }
        video.thumbnail = thumbnail.secure_url
    }
    await video.save()
    const updatedVideo = await Video.findById(videoId)
    return res.status(200).json(new ApiResponse(200, "Video updated successfully", {updatedVideo}))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!req.user._id.equals(video.owner)){
        throw new ApiError(403, "You are not authorized to delete this video")
    }
    await video.deleteOne()
    return res.status(200).json(new ApiResponse(200, "Video deleted successfully", {}))
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }
    if(!req.user._id.equals(video.owner)){
        throw new ApiError(403, "You are not authorized to update this video")
    }
    video.isPublished = !video.isPublishedd
    await video.save()
    const updatedVideo = await Video.findById(videoId)
    return res.status(200).json(new ApiResponse(200, "Video publish status updated", {updatedVideo}))
})

const updateVideoViews = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }
    video.views += 1
    await video.save()
    return res.status(200).json(new ApiResponse(200, "Video views updated", {}))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    updateVideoViews
}
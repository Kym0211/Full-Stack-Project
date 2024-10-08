import {asyncHandler} from './../utils/asyncHandler.js';
import {ApiError} from './../utils/apiError.js';
import { User } from './../models/user.model.js';
import { Video } from './../models/video.model.js';
import {uploadOnCloudinary} from './../utils/cloudinary.js';
import ApiResponse from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateAccessAndRefereshTokens = async (userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, 'Error generating tokens');
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {fullname, email, username, password} = req.body;

    if ( 
        [fullname, email, username, password].some((item) => item?.trim() === "")
    ) {
        throw new ApiError(400, 'Please provide all the fields');
    }

    const existedUser = await User.findOne({
        $or: [
            {email},
            {username}
        ]
    })
    if(existedUser) {
        throw new ApiError(409, 'User already exists');
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath = "";
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath) {
        throw new ApiError(400, 'Please provide avatar image');
    }

    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(500, 'Error uploading avatar image');
    }

    // create user object
    const user = await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) {
        throw new ApiError(500, 'Error creating user');
    }

    return res.status(201).json( new ApiResponse(201,"User created successfully", createdUser));

}) 

const loginUser = asyncHandler(async (req,res) => {

    const {email, username, password} = req.body;
    if(!username && !email) {
        throw new ApiError("400", "Please provide username or email");
    }

    const user = await User.findOne({
        $or: [
            {email},
            {username}
        ]
    })

    if(!user) {
        throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = User.findById(user._id).select("-password -refreshToken");
    // console.log("Logged in user", loggedInUser);

    const optionsForAccessToken = {
        httpOnly: false,
        secure: true,
        maxAge: 1800000
    }
    const optionsForRefreshToken = {
        httpOnly: false,
        secure: true,
        maxAge: 7200000
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, optionsForAccessToken)
    .cookie("refreshToken", refreshToken, optionsForRefreshToken)
    .json(
        new ApiResponse(
            200, 
            {
                user: accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: false,
        secure: true,
    }
    return res  
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, "User logged out successfully", {}))
})

const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    console.log(incomingRefreshToken);
    if(!incomingRefreshToken) {
        throw new ApiError(400, 'Please provide refresh token');
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log(decodedToken);
    
        const user = await User.findById(decodedToken?._id)
        if(!user) {
            throw new ApiError(404, 'User not found');
        }
        if(user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, 'Invalid refresh token');
        } 
    
        const optionsForAccessToken = {
            httpOnly: false,
            secure: true,
            maxAge: 1800000
        }
        const optionsForRefreshToken = {
            httpOnly: false,
            secure: true,
            maxAge: 7200000
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id);
    
        return res  
                .status(200)
                .cookie("accessToken", accessToken, optionsForAccessToken)
                .cookie("refreshToken", refreshToken, optionsForRefreshToken)
                .json(new ApiResponse(200, "Access token refreshed successfully", {accessToken, refreshToken}))
              
    } catch (error) {
        throw new ApiError(401, 'Unauthorized');
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {currentPassword, newPassword} = req.body;

    if(!currentPassword || !newPassword) {
        throw new ApiError(400, 'Please provide current and new password');
    }
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
    if(!isPasswordCorrect) {
        throw new ApiError(400, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});
    return res  
            .status(200)
            .json(new ApiResponse(200, "Password changed successfully", {}))

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, "User found", req.user));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {fullname, email} = req.body;

    if(!fullname && !email) {
        throw new ApiError(400, 'Please provide fullname and email');
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            fullname,
            email
        }
    }, {
        new: true
    }).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, "User updated successfully", user));
})

const updateUserAvatar = asyncHandler( async(req,res) => {
    console.log(req.file);
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath) {
        throw new ApiError(400, 'Please provide avatar image');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar) {
        throw new ApiError(500, 'Error uploading avatar image');
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            avatar: avatar.url
        }
    }, {
        new: true
    }).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, "Avatar updated successfully", user));
})
const updateUserCoverImage = asyncHandler( async(req,res) => {
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath) {
        throw new ApiError(400, 'Please provide cover image');
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage) {
        throw new ApiError(500, 'Error uploading cover image');
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            coverimage: coverImage.url
        }
    }, {
        new: true
    }).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, "Cover image updated successfully", user));
})

const getUserChannelProfile = asyncHandler(async (req,res) => {
    const {username} = req.params;

    if(!username?.trim()) {
        throw new ApiError(400, 'Please provide username');
    
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user._id, "$subscribers.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscriberCount: 1,
                subscribedToCount: 1,
                avatar: 1,
                coverImage: 1,
                isSubscribed: 1,
                email: 1
            }
        }
    ])

    console.log(channel);
    if(!channel?.length) {
        throw new ApiError(404, 'Channel not found');
    }

    return res
            .status(200)
            .json(
                new ApiResponse(200, "channel fetched successfully", channel[0])
            )
    
})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $arrayElemAt: ["$owner", 0]
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
            .status(200)
            .json(
                new ApiResponse(200, "Watch history fetched successfully", user[0]?.watchHistory)
            )
})

const getVideosForHomepage = asyncHandler(async (req, res) => {
    const videos = await Video.find({isPublished: true}).sort({createdAt: -1}).limit(10).populate("owner", "username avatar");
    return res.status(200).json(new ApiResponse(200, "Videos fetched successfully", videos));
})

const saveWatchHistory = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const user = await User.findById(req.user._id);
    if(!user) {
        throw new ApiError(404, 'User not found');
    }

    const video = await Video.findById(videoId);
    if(!video) {
        throw new ApiError(404, 'Video not found');
    }

    if(user.watchHistory.includes(videoId)) {
        return res.status(200).json(new ApiResponse(200, "Watch history updated successfully", {}));
    }

    user.watchHistory.push(videoId);
    await user.save({validateBeforeSave: false});
    return res.status(200).json(new ApiResponse(200, "Watch history updated successfully", {}));
})

const removeVideoFromWatchHistory = asyncHandler(async (req, res) => {
    console.log(req.params)
    const {videoId} = req.params;
    console.log("Video ID", videoId);
    const user = await User.findById(req.user._id);
    if(!user) {
        throw new ApiError(404, 'User not found');
    }

    const video = await Video.findById(videoId);
    if(!video) {
        throw new ApiError(404, 'Video not found');
    }
    console.log(video)

    user.watchHistory = user.watchHistory.filter((id) => id === videoId);
    await user.save({validateBeforeSave: false});
    const updatedWatchHistory = await User.findById(req.user._id).select("watchHistory");
    return res.status(200).json(new ApiResponse(200, "Video removed from watch history successfully", {updatedWatchHistory}));
})

export {
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile,
    getWatchHistory,
    getVideosForHomepage,
    saveWatchHistory,
    removeVideoFromWatchHistory
};
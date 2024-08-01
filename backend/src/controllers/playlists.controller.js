import mongoose, { isValidObjectId} from "mongoose";
import { Playlist } from "../models/playlists.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const user = req.user;
    if(!name || !description){
        throw new ApiError(400, "Name and description are required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: user._id
    });
    const createdPlaylist = await Playlist.findById(playlist._id)
    if(!createdPlaylist){
        throw new ApiError(500, "Playlist could not be created");
    }

    res.status(201).json(new ApiResponse(201, "Playlist created" , createdPlaylist));
})

const getPlayListById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(new ApiResponse(200, "Playlist found", playlist));
})

const getUserPlaylists = asyncHandler(async(req, res) => {
    const {userId} = req.params;
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }

    const playlists = await Playlist.find({owner: userId})
    if(!playlists){
        return res.status(404).json(new ApiResponse(404, "No playlists found"));
    }
    return res.status(200).json(new ApiResponse(200, "Playlists found", playlists));
})

const addVideoToPlaylist = asyncHandler(async(req, res) => {
    const { playlistId, videoId } = req.body;
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist or video id");
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    playlist.videos.push(videoId);
    await playlist.save();
    res.status(200).json(new ApiResponse(200, "Video added to playlist", playlist));
})

const removeVideoFromPlaylist = asyncHandler(async(req, res) => {
    const { playlistId, videoId } = req.body;
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist or video id");
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    playlist.videos = playlist.videos.filter(v => v.toString() !== videoId);
    await playlist.save();
    res.status(200).json(new ApiResponse(200, "Video removed from playlist", playlist));
})

const deletePlaylist = asyncHandler(async(req, res) => {
    const { playlistId } = req.params;
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(new ApiResponse(200, "Playlist deleted"));
})

const updatePlaylist = asyncHandler(async(req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    playlist.name = name;
    playlist.description = description;
    await playlist.save();
    res.status(200).json(new ApiResponse(200, "Playlist updated", playlist));
})

export {
    createPlaylist,
    getPlayListById,
    getUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}

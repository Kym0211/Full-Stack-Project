import { Router } from "express";
import {
    createPlaylist,
    getPlayListById,
    getUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlists.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(createPlaylist);
router.route("/p/:playlistId")
            .get(getPlayListById)
            .patch(updatePlaylist)
            .delete(deletePlaylist);

router.route("/add/:videoId/:playlistId").post(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").delete(removeVideoFromPlaylist);

router.route("/user").get(getUserPlaylists);

export default router;
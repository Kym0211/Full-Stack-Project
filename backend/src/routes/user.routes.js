import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getWatchHistory, getUserChannelProfile, saveWatchHistory, removeVideoFromWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refreshToken").get(refreshAccessToken)
router.route("/changePassword").post(verifyJWT, changeCurrentPassword)
router.route("/currentUser").get(verifyJWT, getCurrentUser)
router.route("/updateAccount").patch(verifyJWT, updateAccountDetails)
router.route("/updateAvatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar)
router.route("/updateCoverImage").patch(verifyJWT, upload.single("coverImage"),updateUserCoverImage)
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)
router.route("/saveHistory/:videoId").post(verifyJWT, saveWatchHistory)
router.route("/removeVideo/:videoId").patch(verifyJWT, removeVideoFromWatchHistory)

export default router
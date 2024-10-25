import { Router } from "express";
import { changePassword, getCurrentUser, getUserChannelProfile, loginUser, logoutUser, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
// import { uploadOnCloudinay } from "../utils/cloudinary.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields(
        [
            {
                name : 'avatar',
                maxCount : 1
            },
            {
                name : 'coverImage',
                maxCount : 1
            }
        ]
    ),
    registerUser );


router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

// secure routes / where login is required
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/update-profile").patch(verifyJWT, updateAccountDetails);
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/update-coverimage").patch(verifyJWT, upload.single("coverimage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
// router.route("/history").get(verifyJWT, getWatchHistory)

export default router; 
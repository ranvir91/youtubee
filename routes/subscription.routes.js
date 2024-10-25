import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT); // apply verifyJWT middleware to all routes in this file

router.route("/c/:channelId").get(getUserChannelSubscribers)
.post(toggleSubscription);

// router.route("/toggle-subscriptions").post();

// getUserChannelSubscribers

router.route("/u/:subscriberId").get(getSubscribedChannels);


export default router;
import { Router } from 'express';
import { toggleSubscription, getUserChannelSubscribers, getSubscibedChannels } from '../controllers/subscription.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyJWT);

router.route("/c/:channelId").post(toggleSubscription);
router.route("/channels").get(getSubscibedChannels);
router.route("/subscribers").get(getUserChannelSubscribers);

export default router;
import { Router } from 'express';
import { getSubcribedChannels, 
    getUserChannelSubscribers,
    toggleSubscription
} from '../controllers/subscriptions.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();
router.use(verifyJWT);

router
    .route("/c/:channelId")
    .get(getSubcribedChannels)
    .post(toggleSubscription);

router.route("/u/:subscriberId").get(getUserChannelSubscribers);

export default router;
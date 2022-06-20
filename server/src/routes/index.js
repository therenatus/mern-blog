import { Router} from 'express';

const router = new Router();
import UserRouter from './userRouter.js';
import LotRouter from './lotRouter.js';
import OfferRouter from './offerRouter.js';


router.use('/user', UserRouter);
router.use('/lot', LotRouter);
router.use('/offer', OfferRouter);

export default router;
import { Router} from 'express';

const router = new Router();
import UserRouter from './userRouter.js';
import LotRouter from './lotRouter.js'


router.use('/user', UserRouter);
router.use('/lot', LotRouter)

export default router;
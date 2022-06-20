import { Router} from 'express';

import { registerValidations, loginValidators } from '../validation/auth.js';
import { OfferController } from '../controller/offerController.js';
import checkAuth from '../middleware/checkAuth.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = new Router();
const controller = new OfferController();


router.post('/', roleMiddleware(["ADMIN", "USER"]), controller.sendOffer);
router.get('/me', checkAuth, controller.getAuthorOffer);
router.get('/lots', roleMiddleware(["ADMIN", "EDITOR"]), controller.getLotsOffers);
// router.get('/all', controller.getAll )

export default router
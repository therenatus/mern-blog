import { Router } from "express";

import { LotController } from '../controller/lotController.js';
import checkAuth from "../middleware/checkAuth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { createLotValidations } from '../validation/lot.js';

const router = new Router();
const controller = new LotController();

router.post('/',checkAuth, roleMiddleware(["ADMIN", "MODERATOR"]), createLotValidations, controller.create);
router.get('/', controller.getAll);
router.get('/:id' , controller.getOne);
router.get('/view/:id' , controller.changeView);
router.delete('/:id',checkAuth, roleMiddleware(["ADMIN"]), controller.remove);
router.patch('/:id', roleMiddleware(["ADMIN"]),controller.update);
router.get('/search/:key', controller.search);

export default router;
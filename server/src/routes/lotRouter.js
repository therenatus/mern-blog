import { Router } from "express";

import { LotController } from '../controller/lotController.js';
import checkAuth from "../middleware/checkAuth.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { createLotValidations } from '../validation/lot.js';

const router = new Router();
const controller = new LotController();

router.post('/',checkAuth, roleMiddleware(["ADMIN", "EDITOR"]), createLotValidations, controller.create);
router.get('/', controller.getAll);
router.get('/:id' , controller.getOne);
router.delete('/:id',checkAuth, roleMiddleware(["ADMIN", "EDITOR"]), controller.remove);
router.patch('/:id', roleMiddleware(["ADMIN", "EDITOR"]),controller.update)

export default router;
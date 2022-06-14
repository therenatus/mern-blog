import { Router } from "express";

import { LotController } from '../controller/lotController.js';
import checkAuth from "../middleware/checkAuth.js";
import { createLotValidations } from '../validation/lot.js';

const router = new Router();
const controller = new LotController();

router.post('/',checkAuth, createLotValidations, controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.delete('/:id',checkAuth, controller.remove);
router.patch('/:id',controller.update)

export default router;
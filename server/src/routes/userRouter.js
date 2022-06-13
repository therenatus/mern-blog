import { Router} from 'express';

import { registerValidations, loginValidators } from '../validation/auth.js';
import { UserController } from '../controller/userController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = new Router();
const controller = new UserController();


router.post('/registration', registerValidations, controller.registration);
router.post('/login', loginValidators, controller.login);
router.get('/me', checkAuth, controller.getMe);

export default router
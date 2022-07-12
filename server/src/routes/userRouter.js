import { Router} from 'express';

import { registerValidations, loginValidators } from '../validation/auth.js';
import { UserController } from '../controller/userController.js';
import checkAuth from '../middleware/checkAuth.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = new Router();
const controller = new UserController();

router.post('/registration', registerValidations, controller.registration);
router.post('/admin', roleMiddleware(["ADMIN"]), controller.createModerator);
router.post('/login', loginValidators, controller.login);
router.get('/me', checkAuth, controller.getMe);
router.get('/com/:id',roleMiddleware(["ADMIN", "MODERATOR"]), controller.getOne);
router.get('/', controller.getAll);
router.get('/companies', controller.getAllUsers);
router.get('/moderators', controller.getAllModerators);

export default router;
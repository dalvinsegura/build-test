import {Router} from "express";
const router = Router();
import { authJwt } from "../middlewares";

import * as authCtrl from '../controllers/auth.controller';

router.post('/signup', authCtrl.signup);
// router.post('/signin', authJwt.isPremium, authCtrl.signin);
router.post('/signin', authCtrl.signin);

export default router;
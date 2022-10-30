import { Router } from "express";
const router = Router();

import * as authCtrl from "../controllers/auth.controller";

import validatorHandler from "../middlewares/validator.handler";
import { signupSchema, signinSchema } from "../schemas/auth.schema";

router.post("/signup", validatorHandler(signupSchema, 'body'),  authCtrl.signup);
router.post("/signin", validatorHandler(signinSchema, 'body'), authCtrl.signin);

export default router;

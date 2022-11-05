import { Router } from "express";
const router = Router();
// IMPORTING AUTH CONTROLLERS FILE
import * as authCtrl from "../controllers/auth.controller";

// IMPORTING VALIDATOR HANDLER AND THEIR SCHEME FOR VALIDATION.
import validatorHandler from "../middlewares/validator.handler";
import { signupSchema, signinSchema } from "../schemas/auth.schema";

// ROUTES WITH A MIDDLERWARE DATA VALIDATOR AND AFTER THAT A ITS FUNCTION. THOSE ROUTES WITH A "authJwt.isAdmin" MIDDLERWARE ARE LIMITING ACCESS ONLY TO ADMIN MEMBERS.

// SIGNING UP A MEMBER WITH A FREE MEMBERSHIP BY DEFAULT.
router.post("/signup", validatorHandler(signupSchema, 'body'),  authCtrl.signup);

// SIGNING IN AND GIVING A TOKEN FOR ACCESSING EVERY ENDPOINT WHICH ARE ALLOWED.
router.post("/signin", validatorHandler(signinSchema, 'body'), authCtrl.signin);

export default router;

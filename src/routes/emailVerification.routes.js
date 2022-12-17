import { Router } from "express";
const router = Router();

// IMPORTING LOGIN HISTORIAL CONTROLLERS FILE
import * as verifyEmailCtrl from "../controllers/emailVerification.controller";

// IMPORTING AUTHJWT FOR VALIDATING THE TOKEN THAT IS SENT BY HEADER.
import { authJwt } from "../middlewares/";

// IMPORTING VALIDATOR HANDLER AND THEIR SCHEME FOR VALIDATION.
import validatorHandler from "../middlewares/validator.handler";
import {
    emailVerification,
    verifyMemberWithAdmin,
} from "../schemas/emailVerification.schema";

// ROUTES WITH A MIDDLERWARE DATA VALIDATOR AND AFTER THAT A ITS FUNCTION. THOSE ROUTES WITH A "authJwt.isAdmin" MIDDLERWARE ARE LIMITING ACCESS ONLY TO ADMIN MEMBERS.

// GETTING A LOGIN HISTORY (FOR SECURITY)
router.post(
  "/:emailToken",
  validatorHandler(emailVerification, "params"),
  verifyEmailCtrl.verifyEmailByEmail
);

router.post(
  "/manual",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    validatorHandler(verifyMemberWithAdmin, "body")
  ],
  verifyEmailCtrl.verifyEmailByAdmin
);

export default router;

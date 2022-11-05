import { Router } from "express";
const router = Router();

// IMPORTING LOGIN HISTORIAL CONTROLLERS FILE
import * as loginHistorialCtrl from "../controllers/loginHistorial.controller";

// IMPORTING AUTHJWT FOR VALIDATING THE TOKEN THAT IS SENT BY HEADER.
import { authJwt } from "../middlewares/";

// IMPORTING VALIDATOR HANDLER AND THEIR SCHEME FOR VALIDATION.
import validatorHandler from "../middlewares/validator.handler";
import { getLoginHistorialSchema } from "../schemas/loginHistorial.schema";

// ROUTES WITH A MIDDLERWARE DATA VALIDATOR AND AFTER THAT A ITS FUNCTION. THOSE ROUTES WITH A "authJwt.isAdmin" MIDDLERWARE ARE LIMITING ACCESS ONLY TO ADMIN MEMBERS.

// GETTING A LOGIN HISTORY (FOR SECURITY)
router.get(
  "/",
  [authJwt.verifyToken, validatorHandler(getLoginHistorialSchema, "body")],
  loginHistorialCtrl.getLoginHistorial
);

export default router;

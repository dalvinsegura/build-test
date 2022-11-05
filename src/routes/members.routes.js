import { Router } from "express";
const router = Router();

// IMPORTING MEMBER CONTROLLERS FILE
import * as memberCtrl from "../controllers/members.controller";

// IMPORTING AUTHJWT FOR VALIDATING THE TOKEN THAT IS SENT BY HEADER.
import { authJwt } from "../middlewares/";

// IMPORTING VALIDATOR HANDLER AND THEIR SCHEME FOR VALIDATION.
import validatorHandler from "../middlewares/validator.handler";
import {
  getMemberByEmailSchema,
  deleteMemberByIdSchema,
} from "../schemas/members.schema";

// ROUTES WITH A MIDDLERWARE DATA VALIDATOR AND AFTER THAT A ITS FUNCTION. THOSE ROUTES WITH A "authJwt.isAdmin" MIDDLERWARE ARE LIMITING ACCESS ONLY TO ADMIN MEMBERS

// GETTING ALL MEMBER FROM DB (ONLY ADMIN)
router.get("/", [authJwt.verifyToken, authJwt.isAdmin], memberCtrl.getMembers);

// GETTING THE PROFILE OF THE MEMBER WHO IS SIGNED IN (MEMBERS AND ADMIN HAVE ACCESS)
router.get(
  "/me",
  [authJwt.verifyToken, validatorHandler(getMemberByEmailSchema, "body")],
  memberCtrl.getMemberByEmail
);

// REMOVING A MEMBER WITH ITS EMAIL FROM DB (ONLY ADMIN)
router.delete(
  "/",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    validatorHandler(deleteMemberByIdSchema, "body"),
  ],
  memberCtrl.deleteMemberById
);

export default router;

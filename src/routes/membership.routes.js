import { Router } from "express";
const router = Router();

// IMPORTING MEMBERSHIP CONTROLLERS FILE
import * as membershipCtrl from "../controllers/membership.controller";

// IMPORTING AUTHJWT FOR VALIDATING THE TOKEN THAT IS SENT BY HEADER.
import { authJwt } from "../middlewares/";

// IMPORTING VALIDATOR HANDLER AND THEIR SCHEME FOR VALIDATION.
import validatorHandler from "../middlewares/validator.handler";
import {
  switchToFreeMembership,
  switchMembershipStatus,
  getMembership,
} from "../schemas/membership.schema";

// ROUTES WITH A MIDDLERWARE DATA VALIDATOR AND AFTER THAT A ITS FUNCTION. THOSE ROUTES WITH A "authJwt.isAdmin" MIDDLERWARE ARE LIMITING ACCESS ONLY TO ADMIN MEMBERS

// BY THIS ROUTE YOU GET ALL INFORMATION ABOUT YOUR MEMBERSHIP. IF YOUR ARE AN ADMIN YOU WILL GET ALL MEMBERS MEMBERSHIP,OTHERWISE, YOUR MEMBER ROLE IS "MEMBER" YOU'LL ONLY GET YOUR MEMBERSHIP.
router.get(
  "/",
  [authJwt.verifyToken, validatorHandler(getMembership, "body")],
  membershipCtrl.getMembership
);

// BY THIS ROUTE YOU CAN GIVE TO A MEMBER A FREE MEMBERSHIP MANUALLLY (ONLY ADMIN)
router.post(
  "/free",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    validatorHandler(switchToFreeMembership, "body"),
  ],
  membershipCtrl.switchToFreeMembership
);

// BY THIS ROUTE YOU CAN SET AN STATUS TO A MEMBER "ACTIVE" OR "INACTIVE"(ONLY ADMIN)
router.post(
  "/status",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    validatorHandler(switchMembershipStatus, "body"),
  ],
  membershipCtrl.switchMembershipStatus
);

export default router;

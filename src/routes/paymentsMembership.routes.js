import { Router } from "express";
const router = Router();

// IMPORTING PAYMENTS MEMBER CONTROLLERS FILE
import * as paymentsMemebershipCtrl from "../controllers/paymentsMembership.controller";

// IMPORTING AUTHJWT FOR VALIDATING THE TOKEN THAT IS SENT BY HEADER.
import { authJwt } from "../middlewares/";

// IMPORTING VALIDATOR HANDLER AND THEIR SCHEME FOR VALIDATION.
import validatorHandler from "../middlewares/validator.handler";
import {
  getpaymentsMembershipForMembers,
  generatePremiumPayment,
  generateLifetimePayment,
  generateFreetrialPayment
} from "../schemas/paymentsmembership.schema";

// ROUTES WITH A MIDDLERWARE DATA VALIDATOR AND AFTER THAT A ITS FUNCTION. THOSE ROUTES WITH A "authJwt.isAdmin" MIDDLERWARE ARE LIMITING ACCESS ONLY TO ADMIN MEMBERS

// GETTING ALL PAYMENTS DONE WHEN A MEMBER PAYED FOR A PREMIUM MEMBERSHIP
router.get(
  "/",
  [
    authJwt.verifyToken,
    validatorHandler(getpaymentsMembershipForMembers, "body"),
  ],
  paymentsMemebershipCtrl.getpaymentsMembershipForMembers
);

// BY THIS ROUTE YOU CAN GIVE A PREMIUM MEMBERSHIP BY THEIR EMAIL (ONLY ADMIN).
router.post(
  "/givePremium",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    validatorHandler(generatePremiumPayment, "body"),
  ],
  paymentsMemebershipCtrl.generatePremiumPayment
);

router.post(
  "/giveLifetime",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    validatorHandler(generateLifetimePayment, "body"),
  ],
  paymentsMemebershipCtrl.generateLifetimePayment
);

router.post(
  "/giveFreetrial",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    validatorHandler(generateFreetrialPayment, "body"),
  ],
  paymentsMemebershipCtrl.generateFreetrialPayment
);

export default router;

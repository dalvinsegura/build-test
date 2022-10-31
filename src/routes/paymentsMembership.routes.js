import { Router } from "express";
const router = Router();
import * as paymentsMemebershipCtrl from "../controllers/paymentsMembership.controller";
import { authJwt } from "../middlewares/";

import validatorHandler from "../middlewares/validator.handler";
import {
  getpaymentsMembershipForMembers,
  generatePremiumPayment,
} from "../schemas/paymentsmembership.schema";

router.get(
  "/",
  [
    authJwt.verifyToken,
    validatorHandler(getpaymentsMembershipForMembers, "body"),
  ],
  paymentsMemebershipCtrl.getpaymentsMembershipForMembers
);

router.post(
  "/givePremium",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    validatorHandler(generatePremiumPayment, "body"),
  ],
  paymentsMemebershipCtrl.generatePremiumPayment
);

export default router;

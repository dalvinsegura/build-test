import { Router } from "express";
const router = Router();
import * as paymentsMemebershipCtrl from "../controllers/paymentsMembership.controller";
import { authJwt, verifyMembership } from "../middlewares/";

router.get(
  "/",
  [authJwt.verifyToken, verifyMembership.isActiveMembership],
  paymentsMemebershipCtrl.getpaymentsMembershipForMembers
);

router.post(
  "/givePremium",
  [authJwt.verifyToken, authJwt.isAdmin],
  paymentsMemebershipCtrl.generatePremiumPayment
);

export default router;

import { Router } from "express";
const router = Router();
import * as paymentsMemebershipCtrl from "../controllers/paymentsMembership.controller";
import { authJwt } from "../middlewares/";

router.get(
  "/",
  authJwt.verifyToken,
  paymentsMemebershipCtrl.getpaymentsMembershipForMembers
);

router.post(
  "/givePremium",
  [authJwt.verifyToken, authJwt.isAdmin],
  paymentsMemebershipCtrl.generatePremiumPayment
);

export default router;

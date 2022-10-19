import { Router } from "express";
const router = Router();
import * as paymentsMemebershipCtrl from "../controllers/paymentsMembership.controller";
import { authJwt } from "../middlewares/";

router.get(
  '/',
  authJwt.verifyToken,
  paymentsMemebershipCtrl.getpaymentsMembershipForMembers
);

router.get(
  '/givePremium',
  [authJwt.verifyToken, authJwt.isAdmin],
  paymentsMemebershipCtrl.generatePremiumPayment
);

// router.get(
//   '/',
//   [authJwt.verifyToken, authJwt.isAdmin],
//   paymentsMemebershipCtrl.getpaymentsMembershipForMembers
// );

export default router;

import { Router } from "express";
const router = Router();
import * as membershipCtrl from "../controllers/membership.controller";
import { authJwt } from "../middlewares/";

router.post(
  "/free",
  [authJwt.verifyToken, authJwt.isAdmin],
  membershipCtrl.switchToFreeMembership
);

router.post(
  "/status",
  [authJwt.verifyToken, authJwt.isAdmin],
  membershipCtrl.switchMembershipStatus
);

export default router;

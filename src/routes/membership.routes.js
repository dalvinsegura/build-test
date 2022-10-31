import { Router } from "express";
const router = Router();
import * as membershipCtrl from "../controllers/membership.controller";
import { authJwt } from "../middlewares/";

import validatorHandler from "../middlewares/validator.handler";
import {
  switchToFreeMembership,
  switchMembershipStatus,
  getMembership,
} from "../schemas/membership.schema";

router.get(
  "/",
  [authJwt.verifyToken, validatorHandler(getMembership, "body")],
  membershipCtrl.getMembership
);

router.post(
  "/free",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    validatorHandler(switchToFreeMembership, "body"),
  ],
  membershipCtrl.switchToFreeMembership
);

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

import { Router } from "express";
const router = Router();
import * as databaseActivitiesCtrl from "../controllers/databaseActivities.controller";
import { authJwt } from "../middlewares/";

import validatorHandler from "../middlewares/validator.handler";

import { getDatabaseActivitiesSchema } from "../schemas/databaseActivities.schema";

router.get(
  "/",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    validatorHandler(getDatabaseActivitiesSchema, "body"),
  ],
  databaseActivitiesCtrl.getDatabaseActivities
);

export default router;

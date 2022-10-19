import { Router } from "express";
const router = Router();
import * as databaseActivitiesCtrl from "../controllers/databaseActivities.controller";
import { authJwt } from "../middlewares/";

router.get(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin],
  databaseActivitiesCtrl.getDatabaseActivities
);

export default router;

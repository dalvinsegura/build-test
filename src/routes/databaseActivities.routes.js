import { Router } from "express";
const router = Router();

// IMPORTING DATABASE ACTIVITIES CONTROLLERS FILE
import * as databaseActivitiesCtrl from "../controllers/databaseActivities.controller";

// IMPORTING AUTHJWT FOR VALIDATING THE TOKEN THAT IS SENT BY HEADER.
import { authJwt } from "../middlewares/";

// IMPORTING VALIDATOR HANDLER AND THEIR SCHEME FOR VALIDATION.
import validatorHandler from "../middlewares/validator.handler";
import { getDatabaseActivitiesSchema } from "../schemas/databaseActivities.schema";

// ROUTES WITH A MIDDLERWARE DATA VALIDATOR AND AFTER THAT A ITS FUNCTION. THOSE ROUTES WITH A "authJwt.isAdmin" MIDDLERWARE ARE LIMITING ACCESS ONLY TO ADMIN MEMBERS

// GETTING ALL DB ACTIVITIES THAT WAS MADE ON THE DB. (FOR AUDITION OR DATA CONTROL).
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

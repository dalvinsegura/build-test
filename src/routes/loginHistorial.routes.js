import { Router } from "express";
const router = Router();
import * as loginHistorialCtrl from "../controllers/loginHistorial.controller";
import { authJwt } from "../middlewares/";

import validatorHandler from "../middlewares/validator.handler";
import { getLoginHistorialSchema } from "../schemas/loginHistorial.schema";

router.get(
  "/",
  [authJwt.verifyToken, validatorHandler(getLoginHistorialSchema, "body")],
  loginHistorialCtrl.getLoginHistorial
);

export default router;

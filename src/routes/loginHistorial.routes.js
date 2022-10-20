import { Router } from "express";
const router = Router();
import * as loginHistorialCtrl from "../controllers/loginHistorial.controller";
import { authJwt, verifyMembership } from "../middlewares/";

router.get('/', [authJwt.verifyToken, verifyMembership.isActiveMembership], loginHistorialCtrl.getLoginHistorial);

export default router;

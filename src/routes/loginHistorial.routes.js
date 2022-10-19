import { Router } from "express";
const router = Router();
import * as loginHistorialCtrl from "../controllers/loginHistorial.controller";
import { authJwt } from "../middlewares/";

router.get('/', authJwt.verifyToken, loginHistorialCtrl.getLoginHistorial);

export default router;

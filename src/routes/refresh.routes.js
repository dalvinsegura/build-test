import { Router } from "express";
const router = Router();
// IMPORTING AUTH CONTROLLERS FILE
import * as refreshCtrl from "../controllers/refreshToken.controller";

router.get("/", refreshCtrl.handleRefreshToken);

export default router;

import { Router } from "express";
const router = Router();
// IMPORTING AUTH CONTROLLERS FILE
import * as logoutCtrl from "../controllers/logout.controller";

router.get("/", logoutCtrl.handleLogout);

export default router;

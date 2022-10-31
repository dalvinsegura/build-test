import { Router } from "express";
const router = Router();
import * as memberCtrl from "../controllers/members.controller";
import { authJwt } from "../middlewares/";

import validatorHandler from "../middlewares/validator.handler";
import {
  getMemberByEmailSchema,
  deleteMemberByIdSchema,
} from "../schemas/members.schema";

router.get("/", [authJwt.verifyToken, authJwt.isAdmin], memberCtrl.getMembers);

router.get(
  "/me",
  [authJwt.verifyToken, validatorHandler(getMemberByEmailSchema, "body")],
  memberCtrl.getMemberByEmail
);

router.delete(
  "/",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    validatorHandler(deleteMemberByIdSchema, "body"),
  ],
  memberCtrl.deleteMemberById
);

export default router;

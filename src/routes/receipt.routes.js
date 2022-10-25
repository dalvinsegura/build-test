import { Router } from "express";
const router = Router();
import * as receiptCtrl from "../controllers/receipt.controller";
import { authJwt, verifyMembership } from "../middlewares/";

router.get("/", authJwt.verifyToken, receiptCtrl.getReceipts);
router.get(
  "/create/:customerId",
  authJwt.verifyToken,
  receiptCtrl.createReceipt
);

export default router;

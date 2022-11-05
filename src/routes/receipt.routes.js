import { Router } from "express";
const router = Router();
import * as receiptCtrl from "../controllers/receipt.controller";
import { authJwt } from "../middlewares/";
import validatorHandler from "../middlewares/validator.handler";
import {
  getReceipts,
  createReceiptBody,
  createReceiptParams,
} from "../schemas/receipt.schema";

router.get(
  "/",
  [authJwt.verifyToken, validatorHandler(getReceipts, "body")],
  receiptCtrl.getReceipts
);

router.post(
  "/create/:customerId",
  [
    authJwt.verifyToken,
    validatorHandler(createReceiptBody, "body"),
    validatorHandler(createReceiptParams, "params"),
  ],
  receiptCtrl.createReceipt
);

export default router;

import { Router } from "express";
const router = Router();

// IMPORTING MEMBER CONTROLLERS FILE
import * as receiptCtrl from "../controllers/receipt.controller";

// IMPORTING AUTHJWT FOR VALIDATING THE TOKEN THAT IS SENT BY HEADER.
import { authJwt } from "../middlewares/";

// IMPORTING VALIDATOR HANDLER AND THEIR SCHEME FOR VALIDATION.
import validatorHandler from "../middlewares/validator.handler";
import {
  getReceipts,
  createReceiptBody,
  createReceiptParams,
} from "../schemas/receipt.schema";

// ROUTES WITH A MIDDLERWARE DATA VALIDATOR AND AFTER THAT A ITS FUNCTION.

// GETTING ALL MEMBER RECEIPT CREATED. IF YOU ARE AN ADMIN YOU WILL GET ALL MEMBERS RECEIPT, YOURS AND OTHERS.
router.get(
  "/",
  [authJwt.verifyToken, validatorHandler(getReceipts, "body")],
  receiptCtrl.getReceipts
);

// BY THIS ROUTE YOU WILL REGISTER A NEW CUSTOMER TO THE DB USING THE EMAIL THAT YOU SIGNED IN.
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

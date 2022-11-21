import { Router } from "express";
const router = Router();

// IMPORTING CUSTOMER CONTROLLERS FILE
import * as customerCtrl from "../controllers/customer.controller";

// IMPORTING AUTHJWT FOR VALIDATING THE TOKEN THAT IS SENT BY HEADER.
import { authJwt } from "../middlewares/";

// IMPORTING VALIDATOR HANDLER AND THEIR SCHEME FOR VALIDATION.
import validatorHandler from "../middlewares/validator.handler";

import {
  customerRegisterSchema,
  getCustomersSchema,
  getCustomerByIdSchema,
  deleteCustomerByIdSchema,
} from "../schemas/customers.schema";


// ROUTES WITH A MIDDLERWARE DATA VALIDATOR AND AFTER THAT A ITS FUNCTION. THOSE ROUTES WITH A "authJwt.isAdmin" MIDDLERWARE ARE LIMITING ACCESS ONLY TO ADMIN MEMBERS.

// REGISTERING A NEW CUSTOMER USING THE MEMBER EMAIL.
router.post(
  "/",
  [authJwt.verifyToken, validatorHandler(customerRegisterSchema, "body")],
  customerCtrl.customerRegister
);

// GETTING ALL MEMBER'S CUSTOMERS WHICH ARE ASSIGNED TO THEIR EMAIL. IF YOU ARE AN ADMIN YOU WILL GET ALL CUSTOMER EITHER YOURS OR NOT.
router.get(
  "/",
  [authJwt.verifyToken, validatorHandler(getCustomersSchema, "body")],
  customerCtrl.getCustomer
);


// GETTING A CUSTOMER BY THEIR ID ASSIGNED ON THE DB.
router.get(
  "/id/:customerId",
  [authJwt.verifyToken, validatorHandler(getCustomerByIdSchema, "params")],
  customerCtrl.getCustomerById
);

// REMOVING A CUSTOMER BY THEIR ID ASSIGNED ON THE DB.
router.delete(
  "/id/:customerId",
  [authJwt.verifyToken, validatorHandler(deleteCustomerByIdSchema, "params")],
  customerCtrl.deleteCustomerById
);

router.get("/pdf", customerCtrl.pdfRender)

export default router;

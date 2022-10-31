import { Router } from "express";
const router = Router();
import * as customerCtrl from "../controllers/customer.controller";
import { authJwt } from "../middlewares/";
import validatorHandler from "../middlewares/validator.handler";

import {
  customerRegisterSchema,
  getCustomersSchema,
  getCustomerByIdSchema,
  deleteCustomerByIdSchema,
} from "../schemas/customers.schema";

router.post(
  "/",
  [authJwt.verifyToken, validatorHandler(customerRegisterSchema, "body")],
  customerCtrl.customerRegister
);

router.get(
  "/",
  [authJwt.verifyToken, validatorHandler(getCustomersSchema, "body")],
  customerCtrl.getCustomer
);

router.get(
  "/:customerId",
  [authJwt.verifyToken, validatorHandler(getCustomerByIdSchema, "params")],
  customerCtrl.getCustomerById
);

router.delete(
  "/:customerId",
  [authJwt.verifyToken, validatorHandler(deleteCustomerByIdSchema, "params")],
  customerCtrl.deleteCustomerById
);

export default router;

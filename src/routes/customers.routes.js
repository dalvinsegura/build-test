import { Router } from "express";
const router = Router();
import * as customerCtrl from "../controllers/customer.controller";
import { authJwt, verifyMembership } from "../middlewares/";

router.post(
  "/",
  [authJwt.verifyToken, verifyMembership.isActiveMembership],
  customerCtrl.customerRegister
);

router.get(
  "/",
  [authJwt.verifyToken, verifyMembership.isActiveMembership],
  customerCtrl.getCustomer
);

router.get("/:customerId", authJwt.verifyToken, customerCtrl.getCustomerById);

// router.put('/:customerId', [authJwt.verifyToken, authJwt.isAdmin], customerCtrl.updateMembersById);

router.delete(
  "/:customerId",
  authJwt.verifyToken,
  customerCtrl.deleteCustomerById
);

export default router;

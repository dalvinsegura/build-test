import Joi from "joi";

const memberEmail = Joi.string().email();
const customerId = Joi.number().integer().greater(0);
const memberMembershipType = Joi.string().min(6).max(7);
const customerPaymentConcept = Joi.string().min(7).max(100);

export const getReceipts = Joi.object({
  memberEmail: memberEmail,
});

export const createReceiptBody = Joi.object({
  memberEmail: memberEmail,
  memberMembershipType: memberMembershipType,
  customerId: customerId,
  customerPaymentConcept: customerPaymentConcept,
});

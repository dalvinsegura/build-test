import Joi from "joi";

const memberEmail = Joi.string().email();
const givePremiumTo = Joi.string().email();
const months = Joi.number().integer().greater(0);

export const getpaymentsMembershipForMembers = Joi.object({
  memberEmail: memberEmail,
});

export const generatePremiumPayment = Joi.object({
  givePremiumTo: givePremiumTo.required(),
  memberEmail: memberEmail,
  months: months.required(),
});

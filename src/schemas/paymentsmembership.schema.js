import Joi from "joi";

const memberEmail = Joi.string().email();
const givePremiumTo = Joi.string().email();
const giveLifetimeTo = Joi.string().email();
const giveFreetrialTo = Joi.string().email();
const months = Joi.number().integer().greater(0);

export const getpaymentsMembershipForMembers = Joi.object({
  memberEmail: memberEmail,
});

export const generatePremiumPayment = Joi.object({
  givePremiumTo: givePremiumTo.required(),
  memberEmail: memberEmail,
  months: months.required(),
});

export const generateFreetrialPayment = Joi.object({
  giveFreetrialTo: giveFreetrialTo.required(),
  memberEmail: memberEmail,
  months: months.required(),
});

export const generateLifetimePayment = Joi.object({
  giveLifetimeTo: giveLifetimeTo.required(),
  memberEmail: memberEmail,
});

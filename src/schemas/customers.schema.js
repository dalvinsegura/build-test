import Joi from "joi";

const name = Joi.string().min(3).max(15);
const lastname = Joi.string().min(3).max(30);
const email_customer = Joi.string().email();

const address = Joi.string().min(5).max(120);
const sector = Joi.string().min(5).max(50);
const house_number = Joi.string().alphanum().max(7);
const payday = Joi.number().integer().greater(0).max(31);
const paymentConcept = Joi.number().integer().greater(100);
const memberEmail = Joi.string().email();

const customerId = Joi.number().integer().greater(0);

export const customerRegisterSchema = Joi.object({
  name: name.required().empty(),
  lastname: lastname.required().empty(),
  email_customer: email_customer.required().empty(),
  address: address.required().empty(),
  sector: sector.required().empty(),
  house_number: house_number.required().empty().uppercase(),
  payday: payday.required().empty(),
  paymentConcept: paymentConcept.required().empty(),
  memberEmail: memberEmail,
});

export const getCustomersSchema = Joi.object({
  memberEmail: memberEmail,
});
export const getCustomerByIdSchema = Joi.object({
  customerId: customerId,
  memberEmail: memberEmail,
});

export const deleteCustomerByIdSchema = Joi.object({
  customerId: customerId.empty(),
  memberEmail: memberEmail,
});

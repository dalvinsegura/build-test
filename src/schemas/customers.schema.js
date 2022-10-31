import Joi from "joi";

const name = Joi.string().min(3).max(15);
const lastname = Joi.string().min(3).max(30);
const address = Joi.string().min(5).max(50);
const sector = Joi.string().min(5).max(50);
const payday = Joi.date().greater("now");
const paymentConcept = Joi.number().integer().greater(100);
const memberEmail = Joi.string().email();

const customerId = Joi.number().integer().greater(0);

export const customerRegisterSchema = Joi.object({
  name: name.required().empty(),
  lastname: lastname.required().empty(),
  address: address.required().empty(),
  sector: sector.required().empty(),
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

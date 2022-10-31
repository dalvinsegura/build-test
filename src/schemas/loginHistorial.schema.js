import Joi from "joi";


const memberRole = Joi.string().min(5).max(10);
const memberEmail = Joi.string().email();


export const getLoginHistorialSchema = Joi.object({
    memberRole: memberRole.required(),
    memberEmail: memberEmail,
  });
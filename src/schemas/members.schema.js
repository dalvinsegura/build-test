import Joi from "joi";

const memberEmail = Joi.string().email();
const memberDelete = Joi.string().email();

export const getMemberByEmailSchema = Joi.object({
  memberEmail: memberEmail,
});

export const deleteMemberByIdSchema = Joi.object({
  memberDelete: memberDelete.required(),
  memberEmail: memberEmail,
});

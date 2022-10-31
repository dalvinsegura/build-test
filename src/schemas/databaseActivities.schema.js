import Joi from "joi";

const memberEmail = Joi.string().email();

export const getDatabaseActivitiesSchema = Joi.object({
  memberEmail: memberEmail,
});

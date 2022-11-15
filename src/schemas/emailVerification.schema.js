import Joi from "joi";

const emailToken = Joi.string();
const emailToVerify = Joi.string().email();
const verificationStatus = Joi.boolean();

export const emailVerification = Joi.object({
  emailToken: emailToken.required(),
});

export const verifyMemberWithAdmin = Joi.object({
  emailToVerify: emailToVerify.required(),
  verificationStatus: verificationStatus.required(),
});

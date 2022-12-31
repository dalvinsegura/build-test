import Joi from "joi";

const emailToVerify = Joi.string().email();
const otpCodeInput = Joi.number().integer().max(99999);

export const emailVerification = Joi.object({
  emailToVerify: emailToVerify.required(),
  otpCodeInput: otpCodeInput.required(),
});

export const verifyMemberWithAdmin = Joi.object({
  emailToVerify: emailToVerify.required()
});

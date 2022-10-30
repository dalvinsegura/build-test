import Joi from "joi";

const email = Joi.string().email();
const name = Joi.string().alphanum().min(3).max(15);
const password = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'));

export const  signupSchema = Joi.object({
    email: email.required(),
    name: name.required(),
    password: password.required(),
});

export const  signinSchema = Joi.object({
    email: email.required(),
    password: password.required(),
});
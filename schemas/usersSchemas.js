import Joi from "joi";
export const registerSchema = Joi.object({
  password: Joi.string().min(5).required(),
  email: Joi.string().required(),
});

export const loginSchema = Joi.object({
  password: Joi.string().min(5).required(),
  email: Joi.string().required(),
});




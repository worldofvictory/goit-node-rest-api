import Joi from "joi";
export const registerSchema = Joi.object({
  password: Joi.string().min(5).required(),
  email: Joi.string().required(),
  subscription: Joi.string().valid(...subscriptions),
});

export const loginSchema = Joi.object({
  password: Joi.string().min(5).required(),
  email: Joi.string().required(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptions)
    .required(),
});


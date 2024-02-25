import Joi from "joi";
import { subsList } from "../helpers/index.js";
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


export const registerSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
  subscription: Joi.string().valid(...subsList),
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
export const emailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
})





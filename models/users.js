import { model, Schema } from 'mongoose';
import { handleMongooseError } from "../helpers/HandleMongooseError.js";
import Joi from "joi";

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        required: false,
        default: "starter"
    },
    token: String
}, { versionKey: false, timestamps: true });

const registerSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
})

const loginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required()
})

export const schema = {
    registerSchema,
    loginSchema
}

userSchema.post("save", handleMongooseError);

export const User = model('user', userSchema);
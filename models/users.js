import { model, Schema } from 'mongoose';
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const userSchema = new Schema(
    {
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
    userSchema.post("save", handleMongooseError);

export const User = model('user', userSchema);
   
import { User } from "../models/users.js";
import { catchAsync, HttpError } from "../helpers/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs/promises"
import gravatar from "gravatar";
import path from "path";
dotenv.config();


const {SECRET_KEY} = process.env;
const avatarsDir = path.resolve("pubblic", "avatars");

export const register = catchAsync(async (req, res) => {
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });
    res.status(201).json(
        {
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            },
        });
});


export const login = catchAsync(async (req, res) => {
   
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }
    const payload = {
        id: user._id
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(user._id, { token });
        
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });
});

export const getCurrent = catchAsync(async (req, res) => {
    const { email, subscription } = req.user;
    res.status(200).json({
        email,
        subscription,
    });
});


export const logout = catchAsync(async (req, res) => {
    
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: " " });
         res.status(204).json();      
  
})

export const update = catchAsync(async (req, res) => {
    const { _id } = req.user;  //id користувача який залогінився і може міняти свою аватарку
     if (!req.file) {
    throw HttpError(400, "Please, attach avatar.It is required.");
  }

    const { path: tempUpload, originalname } = req.file;
    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.resolve(avatarsDir, fileName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });  //витягуючи ід з req міняємо аватарку
 res.status(200).json({
     avatarURL,
    

    });
    


})
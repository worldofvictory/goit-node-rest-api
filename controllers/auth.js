import { User } from "../models/users.js";
import { catchAsync, HttpError, sendEmail } from "../helpers/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs/promises"
import gravatar from "gravatar";
import path from "path";
dotenv.config();
import { nanoid } from "nanoid";


const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.resolve("pubblic", "avatars");

export const register = catchAsync(async (req, res) => {
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href = "${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
    };
    await sendEmail(verifyEmail);
    res.status(201).json(
        {
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            },
        });
});
export const verifyEmail = catchAsync(async (req, res) => {
 const { verificationToken } = req.params; 
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(
        user._id,
        {
            verify: true,
            verificationToken: null,
        }
    )
    res.status(200).json({
        message: "Verification successful",
    })
    
})

export const resendVerifyEmail = catchAsync(async (req, res) => {
     const { email } = req.body; 
    const user = await User.findOne({ email });
    if (!user) {
         throw HttpError(404, "User not found");
    }
          if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href = "${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`
    };
    await sendEmail(verifyEmail);
    
    res.status(200).json({
        message: "Verification email sent",
    })


})

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
    if (!user.verify) {
          throw HttpError(401, "Email not verified");
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
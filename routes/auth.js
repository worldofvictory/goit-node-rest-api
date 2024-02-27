import express from "express";
import { loginSchema, registerSchema, emailSchema } from "../schemas/usersSchemas.js";
import { validateBody } from "../helpers/index.js"
import { autenticate, upload } from "../helpers/index.js"
import {
    register,
    login, 
    getCurrent,
    logout,
    update,
    verifyEmail,
    resendVerifyEmail,
} from "../controllers/auth.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(registerSchema), register);
authRouter.get("/verify/:verificationToken", verifyEmail);
authRouter.post("/verify", validateBody(emailSchema), resendVerifyEmail)
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", autenticate, logout);
authRouter.get("/current", autenticate, getCurrent);
authRouter.patch("/avatars", autenticate, upload.single("avatar"), update)

export default authRouter;
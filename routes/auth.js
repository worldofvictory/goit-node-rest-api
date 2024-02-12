import express from "express";
import  { registerSchema, loginSchema} from "../schemas/usersSchemas.js";
import { validateBody } from "../helpers/validateBody.js"
import { autenticate } from "../helpers/autenticate.js"
import {
    register,
    login, 
    getCurrent,
    logout
} from "../controllers/auth.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.get("/current", autenticate, getCurrent);
authRouter.post("/logout", autenticate, logout);

export default authRouter;
import express from "express";
import { loginSchema, registerSchema } from "../schemas/usersSchemas.js";
import { validateBody } from "../helpers/index.js"
import { autenticate } from "../helpers/index.js"
import {
    register,
    login, 
    getCurrent,
    logout
} from "../controllers/auth.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", autenticate, logout);
authRouter.get("/current", autenticate, getCurrent);

export default authRouter;
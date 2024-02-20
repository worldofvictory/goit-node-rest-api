import express from "express";
import { schema } from "../models/users.js";
import { validateBody } from "../helpers/validateBody.js"
import { autenticate } from "../helpers/autenticate.js"
import {
    register,
    login, 
    getCurrent,
    logout
} from "../controllers/auth.js";

const authRouter = express.Router();
authRouter.post("/register", validateBody(schema.registerSchema), register);
authRouter.post("/login", validateBody(schema.loginSchema), autenticate, login);
authRouter.get("/current", autenticate, getCurrent);
authRouter.post("/logout", autenticate, logout);

export default authRouter;
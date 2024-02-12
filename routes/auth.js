import express from "express";
import  { schema } from "../schemas/usersSchemas.js";
import { validateBody } from "../helpers/validateBody.js"
import {authenticate} from "../helpers/autenticate.js"
import {
    register,
    login, 
    current,
    logout
} from "../controllers/auth.js";
import {authenticate} from "../helpers/autenticate.js"
const authRouter = express.Router();
authRouter.post("/register", validateBody(schema.registerSchema), register);
authRouter.post("/login", validateBody(schema.loginSchema), login);
authRouter.get("/current", authenticate, current);
authRouter.post("/logout", authenticate, logout);

export default authRouter;
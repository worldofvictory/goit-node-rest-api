import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { HttpError } from "./index.js";
import { User } from "../models/users.js";

const { SECRET_KEY = 'tttttttttttttttttttt' } = process.env;

export const autenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401));
  }
};
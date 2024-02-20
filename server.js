import mongoose from 'mongoose';
import { app } from "./app.js";
import dotenv from "dotenv";
import 'dotenv/config'; 





const { MONGO_URL, PORT=3000 } = process.env;

  mongoose
  .connect('mongodb+srv://arizona130892:Mino2019.@cluster0.x4udvyc.mongodb.net/db-contacts')
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
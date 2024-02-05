import mongoose from 'mongoose';
import { app } from "./app";
import 'dotenv/config'; 

const { MONGO_URL, PORT = 3001 } = process.env;

  mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
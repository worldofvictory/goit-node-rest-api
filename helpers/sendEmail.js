import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { META_PASSWORD } = process.env;




const nodemailerConfig = {
     host: "smtp.ukr.net",
  port: 465,
  secure: true,
    auth: {
        user: "viktoriatest@ukr.net",
        pass: META_PASSWORD
    }
};
const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async (data) => {
    const email = { ...data, from: "viktoriatest@ukr.net" };
    await transporter.sendMail(email);
    return true; 
}


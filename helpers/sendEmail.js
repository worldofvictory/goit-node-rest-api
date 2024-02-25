import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { META_PASSWORD } = process.env;


const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: "viktoria130892@meta.ua",
        pass: META_PASSWORD
    }
};
const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async (data) => {
    const email = { ...data, from: "viktoria130892@meta.ua" };
    await transporter.sendMail(email);
    return true; 
}


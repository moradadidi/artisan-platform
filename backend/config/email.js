import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,  // e.g. mygmail@gmail.com
    pass: process.env.EMAIL_PASS,  // the app password from Google
  },
});

export default transporter;

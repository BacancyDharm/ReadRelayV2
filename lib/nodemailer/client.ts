import nodemailer from "nodemailer";
if(!process.env.EMAIL || !process.env.EMAIL_PASS) throw new Error('EMAIL or EMAIL_PASS not found')
    
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});


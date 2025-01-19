// The main thing in this file is transporterInfo and mailInfo.

import nodemailer from "nodemailer";

let transporterInfo = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "sunuwarrozin45@gmail.com",
        pass: "pbgx afbt rrsm ibgw",
    }
}

export let sendEmail = async(mailInfo) => {
    try {
        let transporter = nodemailer.createTransport(transporterInfo);
        let info = await transporter.sendMail(mailInfo);
    } catch (error) {
        console.log("error has occurred", error.message);
    }
};
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465, //or PORT 587
    secure: true,
    auth: {
     user: process.env.GMAIL_USERNAME,
     pass: process.env.GMAIL_PASSWORD,
    },
   });

exports.sendMail=(email, subject, html)=>{
    let mailOptions = {
        to: email,
        subject,
        html
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
}
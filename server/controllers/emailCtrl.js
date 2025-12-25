const nodemailer=require('nodemailer');
const asyncHandler=require('express-async-handler');
const Email=require('../models/emailModel');

const emailsender= asyncHandler(async(data,req,res)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.mail_id,
          pass:process.env.mp,
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      let info = await transporter.sendMail({
          from: '"Reset Password Link" <abc@gmail.com>', // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.htm, // html body
        });
 
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
    )


    //function to send coupons to subscribers

    const sendEmails = async (emails, coupon) => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.mail_id,
          pass:process.env.mp,
        },
      });
    
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: emails.join(', '), // Join the emails array to send to multiple recipients
        subject: 'Exclusive Coupon Just for You!',
        text: `Hello,
    
    You have received an exclusive coupon!
    
    Coupon Name: ${coupon.name}
    Discount: ${coupon.discount}%
    Expiry Date: ${coupon.expiry.toDateString()}
    
    Use this coupon on your next purchase and enjoy the discount!
    
    Best regards,
    Tajjali DryFruits`,
      };
    
      try {
        await transporter.sendMail(mailOptions);
        console.log('Emails sent successfully');
      } catch (error) {
        console.error('Error sending emails:', error);
      }
    };

module.exports={emailsender,sendEmails};
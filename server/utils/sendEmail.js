const nodemailer = require("nodemailer");

const sendEmail = async (email, password, payload, template) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
      },
    });

    const options = () => {
      return {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Reset Password Request - CS Creche",
        text: "You have successfully requested to change your password. Your temporary password is " + password,
        auth: {
            
        }
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        return error;
      } else {
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (error) {
    return error;
  }
};

module.exports = sendEmail;

const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: 'rpmaurya0356@gmail.com',
        pass: "hzokyxrcsbfeiycm",
      },
    });

    await transporter.sendMail({
      from: "rpmaurya0356@gmail.com",
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
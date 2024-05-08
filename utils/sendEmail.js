const nodemailer = require("nodemailer");
const MailGen = require("mailgen");

const sendEmail = async (subject, send_to, template, reply_to, cc) => {
  // To Create Email Transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // To Create Template with MailGen
  const mailGenerator = new MailGen({
    theme: "salted",
    product: {
      name: "DeeShop App",
      link: "http://dee-shop.vercel.app",
    },
  });

  const emailTemplate = mailGenerator.generate(template);
  // To preview the generated Email
  require("fs").writeFileSync("preview.html", emailTemplate, "utf8");

  // Options for sending the Email
  const options = {
    from: process.env.EMAIL_USER,
    to: send_to,
    replyTo: reply_to,
    subject,
    html: emailTemplate,
    cc,
  };

  // To send the Email
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;

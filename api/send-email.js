const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.GMAIL_USER,
      replyTo: email,
      to: process.env.GMAIL_USER,
      subject: `New Contact Form Message`,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if environment variables are set
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error("Missing email configuration");
    return res.status(500).json({ error: "Server email configuration error" });
  }

  try {
    console.log("Creating transport...");
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    console.log("Verifying transport...");
    await transporter.verify();

    console.log("Sending mail...");
    let mailOptions = {
      from: process.env.GMAIL_USER,
      replyTo: email,
      to: process.env.GMAIL_USER,
      subject: `New Contact Form Message`,
      text: `From: ${email}\n\nMessage: ${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Detailed email error:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });
    return res.status(500).json({
      error: "Failed to send email",
      details: error.message,
    });
  }
}

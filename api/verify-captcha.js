const fetch = require("node-fetch");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { token } = req.body; // Token from the front-end
    const secretKey = process.env.GOOGLE_CAPCHA_SECRET_KEY;

    // Verify the token with Google
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (data.success) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, error: data["error-codes"] });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}

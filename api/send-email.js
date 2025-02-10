import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, message } = req.body;

    // Basic validation
    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required" });
    }

    const params = {
      Source: process.env.FROM_EMAIL, // Your verified SES email
      Destination: {
        ToAddresses: [process.env.TO_EMAIL], // Where you want to receive the emails
      },
      Message: {
        Subject: {
          Data: "New Contact Form Submission",
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: `From: ${email}\n\nMessage: ${message}`,
            Charset: "UTF-8",
          },
        },
      },
    };

    const command = new SendEmailCommand(params);
    await sesClient.send(command);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}

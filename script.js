// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded successfully!");
});

// Select all navigation links
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the default anchor behavior

    // Get the target section's ID from the href attribute
    const targetId = this.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);

    // Calculate offset position
    const headerOffset = 80; // Adjust this value to match the header height
    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    // Smoothly scroll to the position
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  });
});

const nodes = document.querySelectorAll(".timeline-node, .sub-node");
const descriptions = document.querySelectorAll(".description");

nodes.forEach((node) => {
  node.addEventListener("click", () => {
    // Deselect all nodes
    nodes.forEach((n) => n.classList.remove("selected"));
    // Select clicked node
    node.classList.add("selected");

    // Hide all descriptions
    descriptions.forEach((desc) => desc.classList.remove("active"));
    // Show corresponding description
    const index = node.dataset.index;
    const desc = document.querySelector(`.description[data-index="${index}"]`);
    if (desc) desc.classList.add("active");
  });
});

document
  .getElementById("contact-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const token = grecaptcha.getResponse();

    console.log("Form data:", { email, message, hasToken: !!token });

    if (!token) {
      alert("Please complete the reCAPTCHA");
      return;
    }

    try {
      // First verify the captcha
      console.log("Verifying captcha...");
      const captchaResponse = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const captchaData = await captchaResponse.json();
      console.log("Captcha response:", captchaData);

      if (!captchaData.success) {
        alert("reCAPTCHA verification failed");
        return;
      }

      // If captcha is verified, send the email
      console.log("Sending email...");
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      const emailData = await emailResponse.json();
      console.log("Email response:", emailData);

      if (emailData.success) {
        alert("Message sent successfully!");
        document.getElementById("contact-form").reset();
        grecaptcha.reset();
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });

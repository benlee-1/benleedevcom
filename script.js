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
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    emailjs
      .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        email: email,
        message: message,
        "g-recaptcha-response": recaptchaResponse,
      })
      .then(
        function (response) {
          alert("Email sent successfully!");
        },
        function (error) {
          alert("Failed to send email. Please try again later.");
        }
      );
  });

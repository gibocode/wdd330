import Alert from "./Alert.js";
import { loadHeaderFooter } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize site-wide alerts
  new Alert().init();

  loadHeaderFooter();

  //Search for handler
  const form = document.getElementById("search-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const query = document.getElementById("search-input").value.trim();
      const urlParams = new URLSearchParams(window.location.search);
      const Selectedcategory = urlParams.get("category") || "tents";
      if (query) {
        window.location.href = `/src/product_listing/index.html?category=${Selectedcategory}&search=${encodeURIComponent(query)}`;
      }
    });
  }

  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterName = document.getElementById("first-name");
  const newsletterEmail = document.getElementById("newsletter-email");
  const newsletterMessage = document.getElementById("newsletter-message");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = newsletterName?.value.trim();
      const email = newsletterEmail?.value.trim();

      const isValidEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

      if (name && email && isValidEmail(email)) {
        newsletterMessage.textContent = "Thank you for subscribing!";
        newsletterMessage.style.color = "black";
        newsletterMessage.style.fontSize = "2rem";
        newsletterMessage.style.fontWeight = "bold";
        newsletterForm.reset();
      } else {
        newsletterMessage.textContent =
          "❌ Please enter a valid name and email.";
        newsletterMessage.style.color = "black";
      }
    });
  }
});

import Alert from "./Alert.js";
import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

document.addEventListener("DOMContentLoaded", () => {
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

  const avatar = document.querySelector("#avatar");
  const registrationForm = document.querySelector("#registration-form");

  if (avatar) {
    avatar.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          displayAvatar(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (registrationForm) {
    registrationForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const payload = JSON.stringify(data);
      const message = await new ExternalServices().register(payload);
      let type = "primary";
      if (message.includes("created")) {
        this.reset();
        hideAvatar(document.querySelector(".avatar-container"));
        type = "success";
      } else if (message.includes("required")) {
        type = "danger";
      }
      showMessage(message, type);
    });
  }

  function displayAvatar(src) {
    const avatarContainer = document.querySelector(".avatar-container");
    const avatarImage = document.createElement("img");
    const removeAvatarButton = document.createElement("button");
    avatarImage.src = src;
    avatarImage.classList.add("avatar-image");
    avatarImage.alt = "Avatar Image";
    removeAvatarButton.textContent = "Remove Avatar";
    removeAvatarButton.classList.add("remove-avatar-button");
    removeAvatarButton.title = "Remove Avatar";
    removeAvatarButton.addEventListener("click", () => {
      hideAvatar(avatarContainer);
    });
    avatarContainer.appendChild(avatarImage);
    avatarContainer.appendChild(removeAvatarButton);
    avatar.classList.add("hide");
    avatar.disabled = true;
  }

  function hideAvatar(parent) {
    parent.innerHTML = "";
    avatar.value = "";
    avatar.classList.remove("hide");
    avatar.disabled = false;
  }

  function showMessage(message, type = "primary") {
    const alert = new Alert();
    let background = "#cce5ff";
    let color = "#004085";
    if (type == "success") {
      background = "#d4edda";
      color = "#155724";
    } else if (type == "danger") {
      background = "#f8d7da";
      color = "#721c24";
    }
    alert.render([
      {
        message: message,
        background: background,
        color: color,
      },
    ]);
    const alertElem = document.querySelector(".alert-list p");
    alertElem.classList.remove("alert-primary");
    alertElem.classList.remove("alert-success");
    alertElem.classList.remove("alert-danger");
    alertElem.classList.add(`alert-${type}`);
  }
});

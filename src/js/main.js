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
      if (query) {
        window.location.href =
          "/src/index.html?search=" + encodeURIComponent(query);
      }
    });
  }
});

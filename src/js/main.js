import Alert from "./Alert.js";
import { loadHeaderFooter } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize site-wide alerts
  new Alert().init();

  loadHeaderFooter();
});

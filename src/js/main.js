import Alert from "./Alert.js";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize site-wide alerts
  new Alert().init();

  // Initialize dynamic product listing
  const dataSource = new ProductData("tents");
  const element = document.querySelector(".product-list");
  const productList = new ProductList("Tents", dataSource, element);
  productList.init();

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

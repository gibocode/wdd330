import { loadHeaderFooter, getParams } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter().then(() => {
  const form = document.getElementById("search-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const query = document.getElementById("search-input").value.trim();
      const urlParams = new URLSearchParams(window.location.search);
      const Selectedcategory = urlParams.get("category") || "tents";
      if (query) {
        window.location.href = `/product_listing/index.html?category=${Selectedcategory}&search=${encodeURIComponent(query)}`;
      }
    });
  }

  const params = getParams();
  const searchCategory = params.category || "tents";
  const searchTerm = params.search || "";

  const dataSource = new ExternalServices();
  const listElement = document.querySelector(".product-list");
  const myList = new ProductList(searchCategory, dataSource, listElement);

  myList.init(searchTerm);
});

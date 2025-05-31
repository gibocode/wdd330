import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam, updateCartCount, loadHeaderFooter } from "./utils.mjs";

const dataSource = new ExternalServices("tents");
const productId = getParam("product");

const product = new ProductDetails(productId, dataSource);
product.init();

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

loadHeaderFooter();

document.querySelector("#add-to-cart").addEventListener("click", () => {
  const cartIcon = document.querySelector(".cart-icon");
  cartIcon.classList.remove("animation");
  void cartIcon.offsetWidth;
  cartIcon.classList.add("animation");
});

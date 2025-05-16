import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount } from "./utils.mjs";

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");

const tentList = new ProductList("tents", dataSource, listElement);
tentList.init();

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

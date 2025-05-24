import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam, updateCartCount, loadHeaderFooter } from "./utils.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

const product = new ProductDetails(productId, dataSource);
product.init();

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

loadHeaderFooter();

import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import Alert from "./Alert.js";

loadHeaderFooter();

new Alert().init();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init();

document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));

document.forms["checkout"].addEventListener("submit", (event) => {
  event.preventDefault();
  let form = event.target;
  order.checkout(form);
});
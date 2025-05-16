import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function displayCartTotal() {
  const cartItems = getLocalStorage("so-cart");
  // check if cart is empty. if so, display message
  if (!cartItems || cartItems.length === 0) {
    return document.querySelector(".cart-footer").innerHTML =
      `Your cart is empty.`;
  } else {
    const total = cartItems.reduce((acc, item) => acc + item.FinalPrice, 0);
    const cartFooter = document.querySelector(".cart-total.hide");
    cartFooter.classList.replace("hide", "show");

    cartFooter.innerHTML = `Total: $${total}`;
  }
}

displayCartTotal();

renderCartContents();

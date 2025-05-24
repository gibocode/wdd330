import { renderWithTemplate2, getLocalStorage, setLocalStorage, loadTemplate, updateCartCount } from "./utils.mjs";

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
    this.cart = [];
  }

  async init() {
    const cartTemplate = await loadTemplate("/partials/cartItem.html");
    const cartItems = getLocalStorage("so-cart") || [];

    renderWithTemplate2(cartTemplate, this.listElement, cartItems);

    const removeButtons = document.querySelectorAll(".remove-from-cart");
    removeButtons.forEach((removeButton) => {
      removeButton.addEventListener("click", () =>
      this.removeItemFromCart(removeButton.getAttribute("data-id")),
      );
    });
    updateCartCount();
    this.displayCartTotal();
  }

  displayCartTotal() {
    const cartItems = getLocalStorage("so-cart") || [];
    const cartTotal = document.querySelector(".cart-total");
    let cartTotalText = "";
    if (cartItems.length > 0) {
      const total = cartItems.reduce((acc, item) => acc + item.FinalPrice, 0);
      cartTotalText = `Total: $${total.toFixed(2)}`;
    } else {
      cartTotalText = "Your cart is empty.";
    }
    cartTotal.textContent = cartTotalText;
  }

  removeItemFromCart(itemId) {
    let cartItems = getLocalStorage("so-cart");
    cartItems = cartItems.filter((item) => item.Id != itemId);
    setLocalStorage("so-cart", cartItems);

    this.init();
  }
}


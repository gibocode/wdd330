import { renderWithTemplate2, getLocalStorage, setLocalStorage, loadTemplate, updateCartCount, updateCartQtyInLocalStorage } from "./utils.mjs";

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
    this.cart = [];
  }

  async init() {
    const cartTemplate = await loadTemplate("../partials/cartItem.html");
    const cartItems = getLocalStorage("so-cart") || [];

    renderWithTemplate2(cartTemplate, this.listElement, cartItems);

    if (cartItems.length > 0) {
      this.increaseQuanity();
      this.decreaseQuanity();
    }

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
      const total = cartItems.reduce((acc, item) => acc + item.FinalPrice * (item.quantity || 1), 0);
      cartTotalText = `Total: $<span>${total.toFixed(2)}</span>`;
    } else {
      cartTotalText = "Your cart is empty.";
    }
    cartTotal.innerHTML = cartTotalText;
  }

  removeItemFromCart(itemId) {
    let cartItems = getLocalStorage("so-cart") || [];
    const itemIndex = cartItems.findIndex(item => item.Id == itemId);

    // Removes 1 element at index {itemIndex}
    cartItems.splice(itemIndex, 1);
    
    /* if (itemIndex > -1) {
      if ((cartItems[itemIndex].quantity || 1) > 1) {
        cartItems[itemIndex].quantity -= 1;
      } else {
        cartItems.splice(itemIndex, 1);
      }
    } */
    setLocalStorage("so-cart", cartItems);

    this.init();
  }

  increaseQuanity() {
    const buttons = document.querySelectorAll(".qty-up");
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const data = event.currentTarget.getAttribute('data-id');
        const productId = data.split(",")[0];
        const productPrice = data.split(",")[1];

        const span = document.getElementById(`qty-${productId}`);
        const total = document.querySelector('.cart-total span');

        const oldQty = parseInt(span.textContent, 10);
        const currentTotal = parseFloat(total.textContent);
        const price = parseFloat(productPrice);

        let newQty = 0;
        if (oldQty >= 1) {
          newQty += 1;
          let sum = currentTotal + newQty * price;
          span.textContent = oldQty + newQty;
          total.textContent  = sum.toFixed(2);
        }

        updateCartQtyInLocalStorage(productId, parseInt(span.textContent));
        updateCartCount();
      });
    });
  }

  decreaseQuanity() {
    const buttons = document.querySelectorAll(".qty-down");
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const data = event.currentTarget.getAttribute('data-id');
        const productId = data.split(",")[0];
        const productPrice = data.split(",")[1];

        const span = document.getElementById(`qty-${productId}`);
        const total = document.querySelector('.cart-total span');

        const oldQty = parseInt(span.textContent, 10);
        const currentTotal = parseFloat(total.textContent);
        const price = parseFloat(productPrice);
       
        let newQty = 0;
        if (oldQty > 1) {
          newQty += 1;
          let sum = currentTotal - (newQty * price);
          span.textContent = oldQty - newQty;
          total.textContent  = sum.toFixed(2);
        }

        updateCartQtyInLocalStorage(productId, parseInt(span.textContent));
        updateCartCount();
      });
    });
  }
}
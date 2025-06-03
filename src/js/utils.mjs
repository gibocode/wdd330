// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touched and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

// Return all the query parameters at once - SearchBox
export function getParams() {
  const queryString = window.location.search;
  return Object.fromEntries(new URLSearchParams(queryString));
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function updateCartCount() {
  const countElement = document.getElementById("cart-count");
  const cart = getLocalStorage("so-cart") || [];
  if (countElement) {
    countElement.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }
}

// updates the cart badge right away
export function addItemToCart(product) {
  const cart = getLocalStorage("so-cart") || [];
  let existingItem = cart.find(item => item.Id === product.Id);

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
    existingItem.totalPrice = existingItem.quantity * existingItem.FinalPrice; // test
  } else {
    product.quantity = 1;
    product.totalPrice = product.FinalPrice;
    cart.push(product);

  }
  setLocalStorage("so-cart", cart);
  updateCartCount();
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template; 
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const header = await loadTemplate("../partials/header.html");
  const footer = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(header, headerElement);
  renderWithTemplate(footer, footerElement);

  updateCartCount();
}

export async function loadCartTemplate() {
  const cartTemplate = await loadTemplate("../partials/cartItem.html");

  const cartElement = document.querySelector(".product-list");
  const cartItems = getLocalStorage("so-cart") || [];

  renderWithTemplate(cartTemplate, cartElement, cartItems);
}

function interpolate(template, data) {
  return template.replace(/\$\{([\w\.]+)\}/g, (_, key) => {
    return key.split(".").reduce((obj, prop) => obj?.[prop], data) ?? "";
  });
}

export function renderWithTemplate2(template, parentElement, dataList) {
  parentElement.innerHTML = dataList.map(item => interpolate(template, item)).join("");
}

export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "SPAN") {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);
  if (scroll) window.scrollTo(0, 0);

}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}

export function getProductComments(productId) {
  const allComments = getLocalStorage("product-comments") || {};
  return allComments[productId] || [];
}

export function saveProductComment(productId, commentObj) {
  const allComments = getLocalStorage("product-comments") || {};
  if (!allComments[productId]) {
    allComments[productId] = [];
  }
  allComments[productId].push(commentObj);
  setLocalStorage("product-comments", allComments);
}

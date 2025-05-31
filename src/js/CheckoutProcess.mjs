import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};
  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  const simplifiedItems = items.map((item) => {
    console.log(item);
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: 1,
    };
  });
  return simplifiedItems;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) { 
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
    this.calculateOrderTotal();
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector(this.outputSelector + " #cartTotal");
    const itemNumElement = document.querySelector(this.outputSelector + " #num-items");
    itemNumElement.innerText = this.list.length;
    const amounts = this.list.map((item) => item.FinalPrice);
    this.itemTotal = amounts.reduce((sum, item) => sum + item);
    summaryElement.innerText = `$${this.itemTotal}`;
  }

  calculateOrderTotal() {
    this.tax = (this.itemTotal * 0.06);
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.orderTotal = (parseFloat(this.itemTotal) + parseFloat(this.tax) + parseFloat(this.shipping));
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const order = formDataToJSON(form);

    // order.orderDate = new Date().toISOString();
    order.orderDate = new Date();
    order.orderTotal = this.orderTotal;
    order.tax = this.tax;
    order.shipping = this.shipping;
    order.items = packageItems(this.list);
    console.log(order);

    try {
      const response = await services.checkout(order);
      console.log(response);
      setLocalStorage("so-cart", []);
      location.assign("/checkout/success.html")
    } catch (err) {
      removeAllAlerts();
      if (Array.isArray(err.message)) {
        err.message.forEach(msg => alertMessage(msg));
      } else {
        alertMessage(err.message);
      }
      console.log(err);

    }
  }
}
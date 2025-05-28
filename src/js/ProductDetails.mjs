import { addItemToCart } from "./utils.mjs";
import BreadcrumbItem from "./components/BreadcrumbItem.js";
import BreadcrumbList from "./components/BreadcrumbList.js";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById("add-to-cart")
      .addEventListener("click", this.addToCart.bind(this));

    // Breadcrumb
    const breadcrumbItems = [
      [this.product.Category, `/product_listing/?category=${this.product.Category}`],
      [this.product.Name, null, true]
    ];
    const breadcrumbList = new BreadcrumbList();
    breadcrumbItems.forEach(itemData => {
      const breadcrumItem = new BreadcrumbItem(itemData[0], itemData[1], itemData[2] ?? false);
      breadcrumbList.addItem(breadcrumItem);
    });
    breadcrumbList.renderItems();
  }

  addToCart(e) {
    const productId = e.target.dataset.id;
    this.dataSource.findProductById(productId).then((product) => {
      addItemToCart(product);
    });
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
  document.querySelector("#p-brand").textContent = product.Brand.Name;
  document.querySelector("#p-name").textContent = product.NameWithoutBrand;

  const productImage = document.querySelector("#p-image");
  productImage.src = product.Images.PrimaryExtraLarge;
  productImage.alt = product.NameWithoutBrand;

  const productSuggestedRetailPrice = product.SuggestedRetailPrice;
  const productPrice = product.FinalPrice;
  const productDiscount = 1 - (productPrice / productSuggestedRetailPrice);

  let productPriceText = `$${productPrice.toFixed(2)}`;

  if (productDiscount > 0) {
    document.getElementById("productSRP").textContent = `SRP: $${productSuggestedRetailPrice.toFixed(2)}`;
    productPriceText += `<span class="product-card__discount">-${Math.round(productDiscount * 100)}% off</span>`;
  }

  document.getElementById("p-price").innerHTML = productPriceText;
  document.getElementById("p-color").textContent = product.Colors[0].ColorName;
  document.getElementById("p-description").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("add-to-cart").dataset.id = product.Id;
}

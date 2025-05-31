import { addItemToCart, alertMessage, getProductComments, saveProductComment } from "./utils.mjs";
import BreadcrumbItem from "./components/BreadcrumbItem";
import BreadcrumbList from "./components/BreadcrumbList";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    this.renderComments();

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

    this.addCommentListener();
  }

  addToCart(e) {
    const productId = e.target.dataset.id;
    this.dataSource.findProductById(productId).then((product) => {
      addItemToCart(product);
      alertMessage(`${product.NameWithoutBrand} has been added to your cart.`);
    });
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }

  renderComments() {
    const commentList = document.getElementById("commentList");
    const comments = getProductComments(this.product.Id);
    commentList.innerHTML = "";

    comments.forEach(({ name, comment }) => {
      const li = document.createElement("li");
      li.textContent = `${name}: ${comment}`;
      commentList.appendChild(li);
    });
  }

  addCommentListener() {
    const form = document.getElementById("commentForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get("name").trim();
      const comment = formData.get("comment").trim();

      if (name && comment) {
        saveProductComment(this.product.Id, { name, comment });
        form.reset();
        this.renderComments();
      }
    });
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

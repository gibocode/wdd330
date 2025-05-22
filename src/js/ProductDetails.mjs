import { addItemToCart} from "./utils.mjs";

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
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
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
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  const productSuggestedRetailPrice = product.SuggestedRetailPrice;
  const productPrice = product.FinalPrice;
  const productDiscount = 1 - (productPrice / productSuggestedRetailPrice);

  let productPriceText = `$${productPrice.toFixed(2)}`;

  if (productDiscount > 0) {
    document.getElementById("productSRP").textContent = `SRP: $${productSuggestedRetailPrice.toFixed(2)}`;
    productPriceText += `<span class="product-card__discount">-${Math.round(productDiscount * 100)}% off</span>`;
  }

  document.getElementById("productPrice").innerHTML = productPriceText;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}

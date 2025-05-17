import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return /* html */`
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="/images/tents/${product.Image.split("/").pop()}" 
             alt="${product.NameWithoutBrand}" />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
      </a>
    </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const items = await this.dataSource.getData();
    // clear out any existing content, then render:
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      items,
      "afterbegin",
      true
    );
  }
}
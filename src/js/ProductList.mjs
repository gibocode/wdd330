import { renderListWithTemplate, getParams } from "./utils.mjs";
import BreadcrumbItem from "./components/BreadcrumbItem";
import BreadcrumbList from "./components/BreadcrumbList";

function productCardTemplate(product) {
  const discounted = product.FinalPrice < product.SuggestedRetailPrice;
  let discount = 0;
  if (discounted) {
    discount = product.SuggestedRetailPrice - product.FinalPrice;
  }
  return `<li class="product-card">
   <div class="${discounted ? "ruban-discount" : ""}" data-discount="${discount.toFixed(2)}"></div>
    <a href="/product_pages/?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.Name}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
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
    const list = await this.dataSource.getData(this.category);
    const params = getParams()

    let filteredList = list;
    if (params.search) {
      const query = params.search.toLowerCase();

      filteredList = list.filter(product =>
        product.Name.toLowerCase().includes(query) ||
        product.Brand.Name.toLowerCase().includes(query)
      );
    }

    this.renderList(filteredList);
    document.querySelector(".title").textContent = this.category;

    // Breadcrumb
    const breadcrumItem = new BreadcrumbItem(`${this.category} (${list.length} Items)`, null, true);
    const breadcrumbList = new BreadcrumbList();
    breadcrumbList.addItem(breadcrumItem);
    breadcrumbList.renderItems();
  }
  renderList(list) {
    if (list.length === 0) {
      this.listElement.innerHTML = `
      <p class="no-results">No products found matching your search. </p>
      <button id="reset-search" class="reset-button">Back to All Products</button>
      `;
    } else {
      renderListWithTemplate(productCardTemplate, this.listElement, list);

      const params = getParams();
      if (params.search) {
        const resetBtn = document.createElement("button");
        resetBtn.textContent = "Back to All Products";
        resetBtn.id = "reset-search";
        resetBtn.classList.add("reset-button");
        this.listElement.insertAdjacentElement("afterend", resetBtn);
      }
    }

    const resetButton = document.getElementById("reset-search");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        window.location.href = "/src/index.html";
      });
    }
  }
}
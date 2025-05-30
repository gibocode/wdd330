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
  constructor(selectedCategory, dataSource, listElement) {
    this.selectedCategory = selectedCategory;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init(searchTerm = "") {
    const productList = await this.dataSource.getData(this.selectedCategory);

    const filteredList = searchTerm
      ? productList.filter((product) =>
        product.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Brand?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : productList;

    this.renderList(filteredList);

    const title = document.querySelector(".title");
    if (title) {
      const categoryFormatted = this.selectedCategory
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
      title.textContent = searchTerm
        ? `${categoryFormatted}: Results for "${searchTerm}"`
        : `${categoryFormatted}`;
    }

    // Breadcrumb
    const breadcrumbItem = new BreadcrumbItem(`${this.selectedCategory} (${filteredList.length} Items)`, null, true);
    const breadcrumbList = new BreadcrumbList();
    breadcrumbList.addItem(breadcrumbItem);
    breadcrumbList.renderItems();
  }

  renderList(list) {
    this.listElement.innerHTML = "";
    if (list.length === 0) {
      this.listElement.innerHTML = `
        <p class="no-results">No products found matching your search. </p>
        <button id="reset-search" class="reset-button">Back to All Products</button>
      `;
    } else {
      renderListWithTemplate(productCardTemplate, this.listElement, list, "beforeend", true);

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
      const selectedCategory = getParams().category || "tents";
      resetButton.addEventListener("click", () => {
        window.location.href = `/product_listing/index.html?category=${selectedCategory}`;
      });
    }
  }
}
import { renderListWithTemplate, getParams, getDiscountPercent } from "./utils.mjs";
import BreadcrumbItem from "./components/BreadcrumbItem";
import BreadcrumbList from "./components/BreadcrumbList";

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent;
}

function shortText(text, maxLength = 100) {
  if (text.length <= maxLength)
    return text;
  return text.slice(0, maxLength).trim() + "...";
}

function productCardTemplate(product) {
  const discounted = product.FinalPrice < product.SuggestedRetailPrice;
  let discount = 0;
  if (discounted) {
    discount = product.SuggestedRetailPrice - product.FinalPrice;
  }
  const plainText = stripHtml(product.DescriptionHtmlSimple);
  const shortDesc = shortText(plainText);
  return `<li class="product-card">
    <div class="${discounted ? "ruban-discount" : ""}" data-discount="${discount.toFixed(2)}"></div>
    <a href="/product_pages/?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.Name}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
      <p>
        <a class="btn-quick-view" role="button" href="#"
          data-product-name="${product.Name}"
          data-color-name="${product.Colors[0].ColorName}"
          data-desc = "${shortDesc}"
          data-final-price="${product.FinalPrice}"
          data-suggested-retail-price="${product.SuggestedRetailPrice.toFixed(2)}"
        >
          <?xml version="1.0" ?><svg class="bi bi-info-circle" fill="currentColor" height="20" viewBox="0 0 16 16" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
        </a>
      </p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(Selectedcategory, dataSource, listElement) {
    this.Selectedcategory = Selectedcategory;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init(searchTerm = "") {
    const productList = await this.dataSource.getData(this.Selectedcategory);

    const filteredList = searchTerm
      ? productList.filter((product) =>
        product.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Brand?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : productList;

    this.renderList(filteredList);

    const title = document.querySelector(".title");
    if (title) {
      const categoryFormatted = this.Selectedcategory
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
      title.textContent = searchTerm
        ? `${categoryFormatted}: Results for "${searchTerm}"`
        : `${categoryFormatted}`;
    }

    // Breadcrumb
    const breadcrumbItem = new BreadcrumbItem(
      `${this.Selectedcategory} (${filteredList.length} Items)`,
      null,
      true
    );
    const breadcrumbList = new BreadcrumbList();
    breadcrumbList.addItem(breadcrumbItem);
    breadcrumbList.renderItems();
    this.renderDialogQuickView();
  }

  renderList(list) {
    this.listElement.innerHTML = "";

    if (list.length === 0) {
      this.listElement.innerHTML = `
        <p class="no-results">No products found matching your search.</p>
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

    // Add listener to reset button
    const resetButton = document.getElementById("reset-search");
    if (resetButton) {
      const Selectedcategory = getParams().category || "tents";
      resetButton.addEventListener("click", () => {
        window.location.href = `/product_listing/index.html?category=${Selectedcategory}`;
      });
    }
  }

  renderDialogQuickView() {
    const buttons = document.querySelectorAll(".btn-quick-view");
    buttons.forEach((button) => { 
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const productName = button.dataset.productName;
        const description = button.dataset.desc;
        const colorName = button.dataset.colorName;
        const finalPrice = button.dataset.finalPrice;
        const suggestedRetailPrice = button.dataset.suggestedRetailPrice;
        this.displayProductQuickView(productName, description, colorName, finalPrice, suggestedRetailPrice);
      });
    });
  }

  displayProductQuickView(productName,description,colorName, finalPrice, suggestedRetailPrice) {
    const dialog = document.getElementById("product-quick-view");
    
    const discount = getDiscountPercent(finalPrice, suggestedRetailPrice);
    let productPriceText = `$${finalPrice}`;
    if (discount > 0) {
      productPriceText += `<span class="product-card__discount">-${discount}% off</span>`;
    }

    dialog.innerHTML = `
    <div class="header">
      <h3>${productName}</h3>
      <button id="closeModal">X</button>
    </div>
    <div class="product-detail">
      <p class="product__color"><strong>Color:</strong> ${colorName}</p>
      <p class="product__description">${description}</p>
      <p class="product-card__srp">SRP: $${suggestedRetailPrice}</p>
      <p class="product-card__price">${productPriceText}</p>
    </div>
    `;

    dialog.showModal();

    document.getElementById("closeModal").addEventListener('click', () => {
      dialog.close();
    });

  }
}

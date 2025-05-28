class BreadcrumbItem {
  constructor(text, link = null, isActive = false) {
    this.text = text;
    this.link = link;
    this.isActive = isActive;
  }

  create() {
    const item = document.createElement("li");
    const text = this.text.charAt(0).toUpperCase() + this.text.slice(1);
    item.classList.add("breacrumb-item");
    if (this.isActive) {
      item.classList.add("active");
      item.ariaCurrent = "page";
      item.innerHTML = text;
    } else {
      const itemLink = document.createElement("a");
      itemLink.href = this.link;
      itemLink.innerHTML = text;
      item.appendChild(itemLink);
    }
    return item;
  }
}

export default BreadcrumbItem;

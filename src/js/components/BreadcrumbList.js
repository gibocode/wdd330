import BreadcrumbItem from "./BreadcrumbItem";

class BreadcrumbList {
  constructor() {
    this.items = [];
    this.init();
  }

  addItem(item) {
    this.items.push(item);
  }

  init() {
    const link = "/index.html";
    const icon = `<svg height="19px" version="1.1" viewBox="0 0 20 19" width="20px">
			<g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
					<g fill="currentColor" id="Core" transform="translate(-506.000000, -255.000000)">
						<g id="home" transform="translate(506.000000, 255.500000)">
							<path d="M8,17 L8,11 L12,11 L12,17 L17,17 L17,9 L20,9 L10,0 L0,9 L3,9 L3,17 L8,17 Z" id="Shape"/>
						</g>
					</g>
			</g>
		</svg>`;
    const home = new BreadcrumbItem(icon, link);
    this.addItem(home);
  }

  renderItems() {
    const list = document.querySelector(".breadcrumb");
    const items = this.items;
    items.forEach((item) => {
      list.appendChild(item.create());
    });
  }
}

export default BreadcrumbList;

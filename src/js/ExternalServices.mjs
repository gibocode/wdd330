const baseURL = import.meta.env.VITE_SERVER_URL;
// const baseURL = "http://server-nodejs.cit.byui.edu:3000/";

async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}

export default class ExternalServices {
  constructor() {
    // this.category = category;
    // this.path = `../json/${this.category}.json`;
  }
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);

    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
    async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
  
  async getAllProducts() {
    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    const allProducts = [];

    for (let cat of categories) {
      const response = await fetch(`${baseURL}products/search/${cat}`);
      const data = await response.json(); // or convertToJson()
      allProducts.push(...data.Result);
    }

    return allProducts;
    }
}
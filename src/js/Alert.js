export default class Alert {
  constructor(jsonPath = "/json/alerts.json", parentSelector = "main") {
    this.jsonPath = jsonPath;
    this.parent = document.querySelector(parentSelector);
  }

  async init() {
    try {
      const res = await fetch(this.jsonPath);
      const alerts = await res.json();
      if (alerts.length) this.render(alerts);
    } catch (err) {
      console.error("Failed to load alerts:", err);
    }
  }

  render(alerts) {
    const section = document.createElement("section");
    section.classList.add("alert-list");

    alerts.forEach(({ message, background, color }) => {
      const p = document.createElement("p");
      p.textContent = message;
      p.style.backgroundColor = background;
      p.style.color = color;
      section.appendChild(p);
    });

    this.parent.prepend(section);
  }
}

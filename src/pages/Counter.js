import Component from "@core/component";

export default class Couter extends Component {
  constructor({ props }) {
    super({ props });
    this.$state = { ...props };
    document.title = "Counter";
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    document.querySelector("main").addEventListener("click", (e) => {
      if (e.target.classList.contains("up-btn")) {
        this.$props.setCounter();
        this.useEvent("view");
      }
    });
  }

  render() {
    return `
            <button class="up-btn">UP</button>
            <p>${this.$props.count}</p>
        `;
  }
}

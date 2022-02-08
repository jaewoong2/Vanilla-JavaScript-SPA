import Component from "@core/component";

export default class Settings extends Component {
  constructor({ props }) {
    super({ props, initialState: { name: "" } });
    this.$target = Settings.createElement();
    document.title = "Settings";
    this.init();
  }

  static createElement() {
    const container = document.createElement("div");
    const form = document.createElement("form");
    const input = document.createElement("input");
    const button = document.createElement("button");

    form.id = "form";
    input.id = "input";

    form.appendChild(input);
    form.appendChild(button);
    container.appendChild(form);

    button.innerText = "Set";
    input.placeholder = "Name";
    input.type = "text";

    return container;
  }

  setProps(props) {
    this.$props = { ...this.$props, ...props };
    this.setState({ ...props });
  }

  bindEvents() {
    const form = this.$target.querySelector("form");
    const input = this.$target.querySelector("input");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (input.value.trim() === "" || this.$state?.name.trim() === "") return;
      this.useEvent("setName", this.$state.name);
      input.value = "";
    });

    input.addEventListener("change", (e) => {
      this.setState({ name: e.target.value });
    });
  }

  init() {
    this.bindEvents();
    this.render();
  }

  render() {
    if (this.$state.name) {
      this.$target.querySelector("input").value = this.$state.name;
    }

    // outerHTML 로 return 하면 eventListner가 사라진다.
    // => element 로 반환
    return this.$target;
  }
}

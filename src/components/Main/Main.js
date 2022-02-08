import Component from "@core/component";

export default class Main extends Component {
  constructor({ parent, initialState = { view: "" } }) {
    super({ parent, initialState });
    this.init();
  }

  static createElement() {
    const main = document.createElement("main");

    return main;
  }

  init() {
    this.$target = Main.createElement();
    this.$parent.appendChild(this.$target);
  }

  setView(view) {
    this.setState({ view });
    if (typeof this.$state.view === "string") {
      this.$target.innerHTML = this.$state.view;
    }

    if (typeof this.$state.view === "object") {
      this.$target.innerHTML = "";
      this.$target.appendChild(this.$state.view);
    }
  }
}

import Component from "@core/component";

export default class Todo extends Component {
  constructor({
    props,
    parent,
    initialState = { todos: [], todo: { isDone: false, text: " " } },
  }) {
    super({ parent, props, initialState });
    this.$target = null;
    document.title = "todo";
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

    button.innerText = "add";
    input.placeholder = "todo";
    input.type = "text";

    return container;
  }

  init() {
    this.$target = Todo.createElement();
    this.bindEvnets();
  }

  bindEvnets() {
    const form = this.$target.querySelector("form");
    const input = this.$target.querySelector("input");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (input.value.trim() === "" || this.$state?.todo?.text?.trim() === "") {
        return;
      }
      this.useEvent("setTodo", this.$state.todo);
      input.value = "";
    });

    input.addEventListener("change", (e) => {
      this.setState({ todo: { text: e.target.value, isDone: false } });
    });
  }

  setProps(props) {
    this.$props = { ...this.$props, ...props };
    this.setState({ ...props });
  }

  render() {
    this.$target.childNodes.forEach((node) => {
      if (node.nodeName === "UL") {
        this.$target.removeChild(node);
      }
    });

    const ul = document.createElement("ul");
    this.$state.todos.forEach(({ text }) => {
      const li = document.createElement("li");
      li.innerHTML = text;
      ul.appendChild(li);
    });

    this.$target.appendChild(ul);
    return this.$target;
  }
}

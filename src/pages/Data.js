import request from "@api/index";
import Component from "@core/component";

export default class Data extends Component {
  constructor({
    props,
    parent,
    initialState = {
      id: 0,
      posts: [{ id: 0, title: "", description: "" }],
      profile: { name: "", nickName: "", image: "" },
    },
  }) {
    super({ props, parent, initialState });

    this.init();
  }

  static createElement() {
    const div = document.createElement("div");
    return div;
  }

  bindEvnets() {
    this.setEvent("getData", async (id) => {
      const data = await request(id);
      this.setState({ ...data[0] });
    });
  }

  init() {
    this.$target = Data.createElement();

    this.$nav = document.createElement("nav");

    [1, 2, 3].forEach((id) => {
      const span = document.createElement("li");
      span.innerHTML = `<a href="?id=${id}">${id}</a>`;
      this.$nav.appendChild(span);
    });

    this.$image = document.createElement("img");
    this.$image.src = this.$state.profile.image;

    this.$ul = document.createElement("ul");
    this.$state.posts.forEach((post) => {
      const li = document.createElement("li");
      li.innerHTML = `<p>${post.title}</p><br/><div>${post.description}</div>`;
      this.$ul.appendChild(li);
    });

    this.$nickName = document.createElement("div");
    this.$nickName.innerHTML = this.$state.profile.nickName;

    this.$target.appendChild(this.$nav);
    this.$target.appendChild(this.$image);
    this.$target.appendChild(this.$ul);
    this.$target.appendChild(this.$nickName);

    this.bindEvnets();
  }

  render() {
    this.$image.src = this.$state.profile.image;

    this.$ul.childNodes.forEach((node) => this.$ul.removeChild(node));
    this.$state.posts.forEach((post) => {
      const li = document.createElement("li");
      li.innerHTML = `<p>${post.title}</p><br/><div>${post.description}</div>`;
      this.$ul.appendChild(li);
    });

    this.$nickName.innerHTML = this.$state.profile.nickName;

    return this.$target;
  }
}

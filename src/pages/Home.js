import Component from "@core/component";

class Home extends Component {
  constructor({ props, parent, initialState }) {
    super({ props, parent, initialState });
    this.$target = null;
  }

  render() {
    return `
        <h1> Hello, ${`${this.$props.name}====>${this.$props.count}`}</h1>
    `;
  }
}

export default Home;

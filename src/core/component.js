class Component {
  constructor({ parent, props, initialState }) {
    this.$parent = parent;
    this.$props = props;
    this.$state = initialState;
  }

  init() {
    return this;
  }

  render() {
    return this;
  }

  bindEvnets() {
    return this;
  }

  setEvent(eventName, callback) {
    this.events = this.events ? this.events : {};
    this.events[eventName] = callback;
  }

  useEvent(eventName, payload) {
    if (this.events[eventName]) this.events[eventName](payload);
  }

  setState(state) {
    this.$state = { ...this.$state, ...state };
    this.render();
  }

  setProps(props) {
    console.log(props);
    this.$props = { ...this.$props, ...props };
    this.render();
  }

  setSubscribe() {
    if (this.$props) {
      this.useEvent("subscribe", {
        props: Object.keys(this.$props),
      });
    }
  }
}

export default Component;

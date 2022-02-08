class Application {
  constructor({ target }) {
    this.$target = target;
    this.$state = {};
    this.$routes = {};
    this.$components = {};
    this.$subscribe = [];
  }

  // 전체를 관리하는 Applictaion 에서 components를 관리 할 수 있도록 Set
  setComponents({ name, component }) {
    if (!name || !component) return;
    this.$components[name] = component;
    this.$components[name].setEvent("subscribe", ({ props }) => {
      props.forEach((state) => {
        this.$subscribe.push({ name: state, component });
      });
    });
    this.$components[name].setSubscribe();
  }

  // 전체를 관리하는 Applictaion 에서 routes 관리 할 수 있도록 Set
  setRoutes({ path, component }) {
    this.$routes[path] = component;
    this.$routes[path].setEvent("subscribe", ({ props }) => {
      props.forEach((state) => {
        this.$subscribe.push({ name: state, component });
      });
    });
    this.$routes[path].setSubscribe();
  }

  setState(state) {
    this.$state = { ...this.$state, ...state };
    this.propProps();
  }

  // 어떤 상태가 변경되었을 때, 그 상태를 구독하고 있는 component 에 변경된 상태를 다시 전파한다.
  propProps() {
    this.$subscribe.forEach(({ name, component }) => {
      if (!this.$state[name]) return;
      const obj = {};
      obj[name] = this.$state[name];
      // component의 setProps는 component가 갖고 있는 props를 변경하는 것 (setProps와 유사)
      component?.setProps({ ...obj });
    });
  }
}

export default Application;

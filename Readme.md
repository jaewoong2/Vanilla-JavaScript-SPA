# Vanilla JavaScript SPA Make my own

## Component & Application

### Component

```js
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
```

```js
constructor({ parent, props, initialState }) {
  this.$parent = parent;
  this.$props = props;
  this.$state = initialState;
}
```

`부모 컴포넌트`, `상속받을 props`, `initialState` 를 `constructor` `Props`로 받는다.

```js
// 구현 해야하는 메소드들

init() {
  return this;
}

render() {
  return this;
}

bindEvnets() {
  return this;
}
```

- `init`: `Component Class` 객체를 생성 할 때, `constructor`에 사용하기 위한 initaial 함수
- `render`: `HTML Element`, `JSX`의 형태를 띈 `string`을 `return` 해야하는 함수

  - `render` 함수는, `routes` 설정에 따라 호출 되기 때문에 꼭 구현 해주어야 한다.

- `bindEvents`: `전역 함수 설정 함수`, 다른 컴포넌트 또는 `Application` 과 해당 컴포넌트 사이 함수들을 엮는다.
  - 예를 들어, `button component` 에서 `click event` 를 했을 때, `count component` 에서 `count state`를 1 증가 시키는 함수를 만들고 엮고 싶을 때, `bindEvent`에 작성 하면된다.

```js
// 구현 하지 않아도 되는 메소드들

setEvent(eventName, callback) {
  this.events = this.events ? this.events : {};
  this.events[eventName] = callback;
}

useEvent(eventName, payload) {
  if (this.events[eventName]) this.events[eventName](payload);
}
```

- `setEvent` 를 통해서 `Callback` 함수를 저장하면 `useEvent` 를 통해서 해당 `Callback` 함수를 사용할 수 있다.

  - ex)

    ```js
    bindEvent() {
      this.setEvent("click", (id) => {
        li.innerHTML = id;
      });

      li.addEventlistener("click", () => {
        this.useEvent("click", li.id);
      });
    }
    ```

```js
// 구현 하지 않아도 되는 메소드들

setState(state) {
  this.$state = { ...this.$state, ...state };
  this.render();
}

setProps(props) {
  this.$props = { ...this.$props, ...props };
  this.render();
}
```

- `setState`: 컴포넌트의 state를 변경 시키는 함수, `render()` 가 호출 된다.
  - 상위 컴포넌트 및 해당 컴포넌트에서 사용 할 수 있음.
    <br />
- `setProps`: 컴포넌트의 props를 변경 시키는 함수, `render()` 가 호출 된다.
  - 주로 상위 컴포넌트에서 사용하기 위해 구현 하였음.

```js
// 구현 하지 않아도 되는 메소드들

setSubscribe() {
  if (this.$props) {
    this.useEvent("subscribe", {
      props: Object.keys(this.$props),
    });
  }
}
```

#### What: Application 에서 state 값을 props 로 내려주는 것 일 때, state 값이 변경 됨에 따라서 하위컴포넌트에서 상속받은 props 값에 반영 시켜주기 위해 구현

1. `Application` 에서 Props를 내려줄 떄, 해당 `setSubscribe` 함수를 호출 하는데, `props`의 값을 `payload` 값으로 보내주며 `subscribe` 이벤트를 발생 시킨다.

2. `props` 값을 `payload` 값으로 받는 `subscribe` 이벤트는 `Application` 의 `$subscribe` 에 `{ name: "props's state name", component }` 형태로 저장 시킨다.

3. `setState` 가 되면, `subscribe` 된 `state` 에따라 `component` 에 반영된 `state` 들을 재상속한다

### Application

```js
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
```

```js
constructor({ target }) {
 this.$target = target;
 this.$state = {};
 this.$routes = {};
 this.$components = {};
 this.$subscribe = [];
}
```

- `$target`: `Application` 의 `Html Element`

- `$state`: `Application` 의 `state`

- `$routes`: `Application` 의 `routes`

  - `{ path, component }` 의 구조로 되어 있으며, 해당 `path` 에서 접속 하면, `component` 가 `render` 되도록 하기 위함

- `$components`: `Application` 의 `components` `routes` 에서 저장하는 `components` 와는 다르다.

- `$subscribe`: `Application` 의 `$subscribe` 목록 들
  - `{ stateName, component }` 로 되어 있으며, `setState`를 할 때마다, `$subscribe`에 저장된 `stateName` 에 따라 `component`에 상속하는 `state` 를 반영 시켜주도록 한다

```js
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
```

`component` 들을 설정 해주고 관리 하고 싶을 때 사용한다. `$components` 에 직접적으로 `push` 하는 것이 아니라, `setComponents({ name, component })` 를 하면 `$component[name]` 은 저장하고 싶은 `component` 가 된다.
<br />
또한, `component` 에 상속해주는 `props` 를 자동으로 관리 할 수 있도록 처리 해준다.

```js
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
```

`routes` 들을 설정 해주고 관리 하고 싶을 때 사용한다. `$routes` 에 직접적으로 `push` 하는 것이 아니라, `setRoutes({ path, component })` 를 하면 `$component[path]` 는 저장하고 싶은 `component` 가 된다.
<br />
또한, `routes` 에 상속해주는 `props` 를 자동으로 관리 할 수 있도록 처리 해준다.

<br />

```js
// 생략
setState(...)
propProps(...)
```

---

## Usage

```js
import Application from "@core/application";
// import Todo from "@pages/Todo";
// import Home from "@pages/Home";
// import Settings from "@pages/Setting";
// import Counter from "@pages/Counter";
import { Counter, Data, Home, Settings, Todo } from "@pages/index";
import router from "@router/index";
import Main from "./Main/Main";
import Nav from "./Nav/Nav";

export default class App extends Application {
  constructor() {
    super({ target: document.getElementById("app") });
    this.$state = {
      count: 0,
      name: "",
      todos: [],
    };
    this.init();
  }

  bindEvents() {
    Object.keys(this.$routes).forEach((path) => {
      this.$routes[path].setEvent("view", () => {
        this.$components?.main?.setView(this?.$routes[path]?.render());
      });
    });

    this.$routes["/settings"].setEvent("setName", (name) => {
      this.setState({ name });
    });

    this.$routes["/todos"].setEvent("setTodo", (todo) => {
      this.setState({ todos: [...this.$state.todos, todo] });
      console.log(todo);
      console.log(this.$state.todos);
    });

    this.$routes["/data"].useEvent(
      "getData",
      (() => {
        const qs = new URLSearchParams(window.location.search);
        const hash = qs.get("id");
        return hash || 1;
      })()
    );
  }

  init() {
    const { useRouter, setRouterState } = router();

    this.setComponents({
      name: "nav",
      component: new Nav({ parent: this.$target }),
    });

    this.setComponents({
      name: "main",
      component: new Main({ parent: this.$target }),
    });

    this.setRoutes({
      path: "/",
      component: new Home({
        props: {
          name: this.$state.name,
          count: this.$state.count,
        },
      }),
    });

    this.setRoutes({ path: "/data", component: new Data({}) });

    this.setRoutes({
      path: "/counter",
      component: new Counter({
        props: {
          count: this.$state.count,
          setCounter: () => {
            this.setState({ count: this.$state.count + 1 });
          },
        },
      }),
    });

    this.setRoutes({
      path: "/settings",
      component: new Settings({ props: { name: this.$state.name } }),
    });

    this.setRoutes({
      path: "/todos",
      component: new Todo({ props: { todos: this.$state.todos } }),
    });

    this.bindEvents();

    // 라우팅 설정 => 렌더링
    setRouterState({
      routes: Object.keys(this.$routes).map((path) => ({
        path,
        view: this.$routes[path],
      })),
      parent: this?.$components?.main.$target,
    });

    useRouter();
  }
}
```

1. `router` 설정

- `const { useRouter, setRouterState } = router();`

2. 각종 `component`, `routes` 설정

- 필수 및 예시:

  ```js
  /* WHY?
   * 1. router 에서 main을 부모 컴포넌트로 설정 하도록 되어있다
   * 2. bindeEvents 에서 main 에서 render 되도록 설정 했다.
   '''
       Object.keys(this.$routes).forEach((path) => {
      this.$routes[path].setEvent("view", () => {
        this.$components?.main?.setView(this?.$routes[path]?.render());
      });
    });
   '''
   */
  this.setComponents({
    name: "main",
    component: new Main({ parent: this.$target }),
  });
  ```

- 예)
  ```js
  this.setRoutes({
    path: "/counter",
    component: new Counter({
      props: {
        count: this.$state.count,
        setCounter: () => {
          this.setState({ count: this.$state.count + 1 });
        },
      },
    }),
  });
  ```

3. `bindEvent, setRouterState, useRotuer` 실행하기

   ```js
   this.bindEvents();

   // 라우팅 설정 => 렌더링
   setRouterState({
     routes: Object.keys(this.$routes).map((path) => ({
       path,
       view: this.$routes[path],
     })),
     parent: this?.$components?.main.$target,
   });

   useRouter();
   ```

## Router

### router 설정

```js
let $state = { routes: [], parent: null };

const router = () => {
  const setRouterState = ({ routes, parent }) => {
    $state = { routes, parent, isSetted: true };
  };

  const useRouter = () => {
    const { routes, parent } = $state;

    if (!parent) {
      document.body.innerHTML = "Error!";
      return;
    }

    /** { result: location.pathName is route-path } */
    const potentialMatches = routes.map((route) => ({
      route,
      result: window.location.pathname === route.path,
    }));

    /** location.pathname = route-path */
    const match = potentialMatches.find(
      (potentialMatch) => potentialMatch.result !== false
    );

    if (!match) {
      document.body.innerHTML = "Error!";
      return;
    }
    // match에 해당하는 route의 event를 실행
    match.route.view.useEvent("view");
  };

  const navigateTo = (url) => {
    window.history.pushState(null, null, url);
    useRouter();
  };

  return { useRouter, setRouterState, navigateTo };
};

export default router;
```

- `setRouterState`: router 를 설정하기전에 미리 set 해줘야 하는 함수

- `useRouter`: 각종 라우터 설정을 실행 시키는 함수

- `navigateTo`: `history.go()` 와 비슷한 역할을 함

> 추후 작성: history.pushState 설명

## Main Component

```js
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
```

`setView`: `routes` 들이 `setEvent('view', () => ...)` 의 이벤트가 생기는데, 이는, routes 의 컴포넌트를 render 하며 그 render 값을 main 컴포넌트에 `append` 시키기 위한 이벤트 이다.
<br />
`main component`에 `render` 값을 넣어주기 위해서 `setView`를 `view` 이벤트에서 호출 시킨다.

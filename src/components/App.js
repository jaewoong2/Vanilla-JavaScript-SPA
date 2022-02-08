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

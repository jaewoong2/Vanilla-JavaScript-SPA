import App from "@components/App";
import router from "@router/index";
import "./index.css";

const app = new App();

const { useRouter, navigateTo } = router();

window.addEventListener("popstate", useRouter);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  useRouter();
});

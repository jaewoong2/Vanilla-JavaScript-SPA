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

import { piniaActions } from "src/stores/piniaActions";
import { piniaState } from 'src/stores/piniaState';

export default ({ router }: { router: any }) => {
  const publicPages = ['landing', 'login'];

  router.beforeEach((to: any, from: any, next: any) => {
    const actions = piniaActions();
    const store = piniaState();
    const hasToken = !!store.auth?.token;

    if (hasToken) {
      actions.setAuthToken({
        token: store.auth.token,
        refresh_token: store.auth.refresh_token
      });
    }

    // Защита приватных страниц
    if (!hasToken && !publicPages.includes(to.name)) {
      return next({ name: 'login' });
    }

    if (hasToken && publicPages.includes(to.name)) {
      return next({ name: 'Tabel' });
    }

    const accessList = piniaState().accessList.map((el: any) => el.app_actions_id);
    if (to.meta.app_actions_id && to.meta.app_actions_id !==0 && !accessList.includes(to.meta.app_actions_id)) {
      return next({ name: 'not-allowed-route' });
    }

    next();
  });

  return router;
};

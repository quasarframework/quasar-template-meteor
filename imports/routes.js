// Import the router
import {Router, nativeScrollBehavior} from 'meteor/akryum:vue-router2';

// Create router instance
const router = new Router({
  mode: 'history',
  scrollBehavior: nativeScrollBehavior,
});

// Not found
import NotFound from '/imports/ui/NotFound.vue';

Router.configure(router => {
  router.addRoute({
    path: '*',
    component: NotFound,
  });
}, -1);

export default router;

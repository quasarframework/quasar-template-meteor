
import {Meteor} from 'meteor/meteor';
import Vue from 'vue';


// Import the router factory
import { RouterFactory, nativeScrollBehavior } from 'meteor/akryum:vue-router2'

// Create router instance
// See https://github.com/meteor-vue/vue-meteor/tree/master/packages/vue-router2
// - actual routes are configured in routes.js
const routerFactory = new RouterFactory({
    mode: 'history',
    scrollBehavior: nativeScrollBehavior,
})


// App layout
import AppLayout from '/imports/ui/AppLayout.vue';


//import Quasar globally
//import Quasar from 'quasar-framework';
import Quasar from '/node_modules/quasar-framework/dist/quasar.common.js';
Vue.use(Quasar, {});

//App start
Meteor.startup(() => {
    const router = routerFactory.create();
    new Vue({
        router: router,
        render: h => h(AppLayout),
    }).$mount('app');
});


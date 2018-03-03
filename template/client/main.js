
import {Meteor} from 'meteor/meteor';
//quasar framework is based on vuejs
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
//swap the comment on these lines if you want to compile for ios
import Quasar from '/node_modules/quasar-framework/dist/quasar.mat.common.js';
//import Quasar from '/node_modules/quasar-framework/dist/quasar.ios.common.js';
Vue.use(Quasar, {});

//App start
Meteor.startup(() => {
    const router = routerFactory.create();
    new Vue({
        router: router,
        render: h => h(AppLayout),
    }).$mount('app');
});


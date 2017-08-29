
import {Meteor} from 'meteor/meteor';
import Vue from 'vue';
import routerFactory from '/imports/routes';

// App layout
import AppLayout from '/imports/ui/AppLayout.vue';


//App start
Meteor.startup(() => {
    const router = routerFactory.create()
        new Vue({
            router: router,
            render: h => h(AppLayout),
        }).$mount('app');
});


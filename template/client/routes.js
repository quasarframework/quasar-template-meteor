// Import the router
import { RouterFactory } from 'meteor/akryum:vue-router2'
// Components
import Home from '/imports/ui/Home.vue'
import Session from '/imports/ui/Session.vue'
import Help from '/imports/ui/Help.vue'

RouterFactory.configure(factory => {
    // Simple routes
    factory.addRoutes([
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/session',
            name: 'session',
            component: Session,
        },
        {
            path: '/help',
            name: 'help',
            component: Help,
        },
    ])
})
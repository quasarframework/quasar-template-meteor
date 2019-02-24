<template name="appLayout">


        <q-layout ref="layout" view="LHr lpR lFr">

            <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-btn
                        flat round dense
                        @click="showLeft = !showLeft"
                        icon="menu"
                />

                <q-toolbar-title>
                    Layout Header
                </q-toolbar-title>

                <q-btn
                        flat round dense
                        @click="showRight = !showRight"
                        icon="menu"
                />
            </q-toolbar>
            <q-tabs>
                <q-route-tab slot="title" icon="save" to="/" replace label="PubSub" />
                <q-route-tab slot="title" icon="alarm" to="/session" replace label="Session" />
                <q-route-tab slot="title" icon="help" to="/help" replace label="Help" />
            </q-tabs>
        </q-header>

        <q-drawer side="left" v-model="showLeft">
            <q-list no-border link inset-separator>
                <q-item-label header>Essential Links</q-item-label>
                <q-item clickable v-ripple  to="/">
                    <q-item-section avatar>
                        <q-icon color="primary" name="save" />
                    </q-item-section>
                    <q-item-section>PubSub</q-item-section>
                </q-item>
                <q-separator spaced inset="item" />
                <q-item clickable v-ripple  to="/session">
                    <q-item-section avatar>
                        <q-icon color="primary" name="alarm" />
                    </q-item-section>
                    <q-item-section>Session</q-item-section>
                </q-item>
                <q-separator spaced inset="item" />
                <q-item clickable v-ripple  to="/help">
                    <q-item-section avatar>
                        <q-icon color="primary" name="help" />
                    </q-item-section>
                    <q-item-section>Help</q-item-section>
                </q-item>
                <q-separator spaced inset="item" />
            </q-list>
        </q-drawer>

        <q-drawer side="right" v-model="showRight">
            <span>Right Drawer</span>
        </q-drawer>

        <q-page-container>
            <router-view></router-view>
        </q-page-container>

        <q-footer>
            <q-toolbar>
                <q-toolbar-title>
                    <span>Footer is here</span>
                </q-toolbar-title>
            </q-toolbar>
        </q-footer>

    </q-layout>

</template>

<script>

    import {Meteor} from 'meteor/meteor';

    //See main.js for the global import of 'Quasar' and vue.use() method.
    //Don't move the 'Quasar' import from main.js - importing 'Quasar' later causes an error


    import '/node_modules/quasar/dist/quasar.min.css'

    import {
        QLayout,
        QHeader,
        QFooter,
        QDrawer,
        QToolbar,
        QToolbarTitle,
        QTabs,
        QRouteTab,
        QBtn,
        QIcon,
        QItem,
        QItemSection,
        QList,
        QPageContainer,
    } from '/node_modules/quasar/dist/quasar.esm';


    // To make the material-icons appear, we also have to add links in the /public folder
    // to the web-font folder with the .css and .woff files
    // in node_modules/@quasar/extras/material-icons.
    //I find that this import for the material-icons needs to come after all the other quasar imports
    import '/node_modules/@quasar/extras/material-icons/material-icons';

    export default {
        data: function () {
            return {
                showLeft: false,
                showRight: false
            }
        },
        props: {
            uiid: 'mat'
        },
        components: {
            QLayout,
            QHeader,
            QFooter,
            QDrawer,
            QToolbar,
            QToolbarTitle,
            QTabs,
            QRouteTab,
            QBtn,
            QIcon,
            QItem,
            QItemSection,
            QList,
            QPageContainer,
        }
    }
</script>

<template name="appLayout">

    <!-- be careful when you change the 'view' prop, check the layout docs -->
    <!--  LHr lpR lfr - with class="fixed-bottom" on the footer seems to be the only possibility
        that works both for desktop and mobile -->

    <q-layout ref="layout" view="LHr lpR lFr">

        <q-layout-header>
            <q-toolbar>
                <q-btn
                        flat round dense
                        @click="showLeft = !showLeft"
                        icon="menu"
                />

                <q-toolbar-title>
                    Layout Header
                    <!--<span slot="subtitle">Optional subtitle</span>-->
                </q-toolbar-title>

                <!-- showRight is a model attached to right side drawer below -->
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
        </q-layout-header>

        <q-layout-drawer side="left" v-model="showLeft">
            <q-list no-border link inset-separator>
                <q-list-header>Essential Links</q-list-header>
                <q-item to="/">
                    <q-item-side icon="save" />
                    <q-item-main label="PubSub" />
                </q-item>
                <q-item to="/session">
                    <q-item-side icon="alarm" />
                    <q-item-main label="Session" />
                </q-item>
                <q-item to="/help">
                    <q-item-side icon="help" />
                    <q-item-main label="Help" />
                </q-item>
            </q-list>
        </q-layout-drawer>

        <q-layout-drawer side="right" v-model="showRight">
            <span>Right Side of Layout</span>
        </q-layout-drawer>

        <q-page-container>
            <router-view></router-view>
        </q-page-container>

        <q-layout-footer>
            <q-toolbar>
                <q-toolbar-title>
                    Footer is here
                </q-toolbar-title>
            </q-toolbar>
        </q-layout-footer>

    </q-layout>

</template>

<script>



    //See main.js for the global import of 'Quasar' and vue.use() method.
    //Don't move the 'Quasar' import from main.js - importing 'Quasar' later causes an error

    //For some reason material-icons.css cannot find './MaterialIcons-Regular.woff'
    //even though is in the same folder as itself, so we've had to symlink
    // /node-modules/quasar-extras/material-icons/MaterialIcons-Regular.woff to /public
    import '/node_modules/quasar-extras/material-icons/material-icons.css';

    if(Meteor.isCordova && cordova.platformId == 'ios'){
        import('/node_modules/quasar-framework/dist/umd/quasar.ios.min.css');
    }else{
        import('/node_modules/quasar-framework/dist/umd/quasar.mat.min.css');
    }

    //swap the comments on these lines if you want to compile for ios
    import {
        QLayout, QToolbar, QToolbarTitle, QTabs, QTab, QRouteTab, QBtn, QIcon,
        QItemMain, QItemSide, QList, QListHeader, QLayoutHeader, QLayoutFooter, QLayoutDrawer, QPageContainer, QItem
    } from '/node_modules/quasar-framework/dist/quasar.mat.esm.js';
    // import {
    //     QLayout, QToolbar, QToolbarTitle, QTabs, QTab, QRouteTab, QBtn, QIcon,
    //     QItemMain, QItemSide, QList, QListHeader, QLayoutHeader, QLayoutFooter, QLayoutDrawer, QPageContainer, QItem
    // } from '/node_modules/quasar-framework/dist/quasar.ios.esm.js';



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
            QLayoutFooter,
            QLayoutHeader,
            QLayoutDrawer,
            QLayout,
            QToolbar,
            QToolbarTitle,
            QTabs,
            QTab,
            QRouteTab,
            QBtn,
            QIcon,
            QItemMain, QItemSide,
            QList, QListHeader, QPageContainer,
            QItem
        }
    }
</script>

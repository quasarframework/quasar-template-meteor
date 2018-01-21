<template>
    <q-layout ref="layout" view="hHr LpR lFf" :right-breakpoint="1100">
        <!-- Header -->
        <q-toolbar slot="header">
            <q-btn flat @click="$refs.layout.toggleLeft()">
                <q-icon name="menu" />
            </q-btn>
            <q-toolbar-title>
                Layout Header
                <span slot="subtitle">Optional subtitle</span>
            </q-toolbar-title>
            <q-btn flat @click="$refs.layout.toggleRight()">
                <q-icon name="menu" />
            </q-btn>
        </q-toolbar>
        <!-- Navigation Tabs -->
        <q-tabs slot="navigation">
            <q-route-tab slot="title" icon="save" to="/" replace label="PubSub" />
            <q-route-tab slot="title" icon="alarm" to="/session" replace label="Session" />
            <q-route-tab slot="title" icon="help" to="/help" replace label="Help" />
        </q-tabs>
        <!-- Left-side Drawer -->
        <div slot="left">
            <q-list no-border link inset-separator>
                <q-list-header>Essential Links</q-list-header>
                <q-side-link item to="/">
                    <q-item-side icon="save" />
                    <q-item-main label="PubSub" />
                </q-side-link>
                <q-side-link item to="/session">
                    <q-item-side icon="alarm" />
                    <q-item-main label="Session" />
                </q-side-link>
                <q-side-link item to="/help">
                    <q-item-side icon="help" />
                    <q-item-main label="Help" />
                </q-side-link>
             </q-list>
        </div>
        <!-- IF USING subRoutes only:-->
        <router-view/>
        <!-- OR ELSE, IF NOT USING subRoutes:
        <div class="layout-view"></div>-->
        <!-- Right Side Panel -->
        <div slot="right">
            Right Side of Layout
        </div>
        <!-- Footer -->
        <div slot="footer">
            <span>footer is here</span>
        </div>
    </q-layout>
</template>

<script>

    //See main.js for the global import of 'Quasar' and vue.use() method.
    //Don't move the 'Quasar' import from main.js - importing 'Quasar' later causes an error

    //we've had to symlink all the material-icons material from /node-modules/quasar-extras/material-icons
    //to /public because for some reason material-icons.css cannot find './MaterialIcons-Regular.woff'
    // which is in the same folder as itself
    import '/public/material-icons';

    //we have to check that we are on the client otherwise server side code complains
    if(Meteor.isCordova){

        if(cordova.platformId == 'android'){
            //dynamic import
            import('/node_modules/quasar-framework/dist/quasar.mat.css');
        }
        else if(cordova.platformId == 'ios'){
            import('/node_modules/quasar-framework/dist/quasar.ios.css');
        }

    }else{
        //default
        import('/node_modules/quasar-framework/dist/quasar.mat.css');

    }
    //we import components individually, it should reduce bundle size
    import {
        QLayout, QToolbar, QToolbarTitle, QTabs, QTab, QRouteTab, QBtn, QIcon,
        QSideLink, QItemMain, QItemSide, QList, QListHeader
    } from '/node_modules/quasar-framework/dist/quasar.common.js';

    export default {
        components: {
            QLayout,
            QToolbar,
            QToolbarTitle,
            QTabs,
            QTab,
            QRouteTab,
            QBtn,
            QIcon,
            QSideLink, QItemMain, QItemSide,
            QList, QListHeader
        }
    }
</script>

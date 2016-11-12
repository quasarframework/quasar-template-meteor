<template>
    <quasar-layout>
        <!-- Header -->
        <div slot="header" class="toolbar">
            <!-- opens left-side drawer using its ref -->
            <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
                <i>menu</i>
            </button>
            <quasar-toolbar-title :padding="1">
                Title
            </quasar-toolbar-title>
            <!-- opens right-side drawer using its ref -->
            <button class="hide-on-drawer-visible" @click="$refs.rightDrawer.open()">
                <i>menu</i>
            </button>
        </div>
        <!-- Navigation Tabs -->
        <quasar-tabs slot="navigation">
            <quasar-tab icon="mail" route="/" exact replace>Mails</quasar-tab>
            <quasar-tab icon="alarm" route="/clockalarm" exact replace>Alarms</quasar-tab>
            <quasar-tab icon="help" route="/help" exact replace>Help</quasar-tab>
        </quasar-tabs>
        <!-- Left-side Drawer -->
        <quasar-drawer ref="leftDrawer">
            <div class="toolbar">
                <quasar-toolbar-title>
                    Drawer Title
                </quasar-toolbar-title>
            </div>
            <div class="list no-border platform-delimiter">
                <quasar-drawer-link icon="mail" to="/" exact>
                    Mails
                </quasar-drawer-link>
                <quasar-drawer-link icon="alarm" to="/clockalarm" exact>
                    Alarm
                </quasar-drawer-link>
                <quasar-drawer-link icon="help" to="/help" exact>
                    Help
                </quasar-drawer-link>
            </div>
        </quasar-drawer>
        <!-- IF USING subRoutes only: -->
        <router-view class="layout-view"></router-view>
        <!-- OR ELSE, IF NOT USING subRoutes:
        <div class="layout-view"></div>-->
        <!-- Right-side Drawer -->
        <quasar-drawer ref="rightDrawer" right-side>
            right drawer
        </quasar-drawer>
        <!-- Footer -->
        <div slot="footer" class="toolbar">
            <span>footer is here</span>
        </div>
    </quasar-layout>
</template>

<script>
    import 'quasar-framework/dist/quasar.ios.css';
    import 'quasar-framework/dist/quasar.mat.css';
    //alert('wot'); // this works from http on mobile
</script>

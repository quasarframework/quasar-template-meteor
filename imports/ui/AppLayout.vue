<template>
    <q-layout>
        <!-- Header -->
        <div slot="header" class="toolbar">
            <!-- opens left-side drawer using its ref -->
            <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
                <i>menu</i>
            </button>
            <q-toolbar-title :padding="1">
                Title
            </q-toolbar-title>
            <!-- opens right-side drawer using its ref -->
            <button class="hide-on-drawer-visible" @click="$refs.rightDrawer.open()">
                <i>menu</i>
            </button>
        </div>
        <!-- Navigation Tabs -->
        <q-tabs slot="navigation">
            <q-tab icon="mail" route="/" exact>Mails</q-tab>
            <q-tab icon="alarm" route="/clockalarm" exact>Alarms</q-tab>
            <q-tab icon="help" route="/help" exact>Help</q-tab>
        </q-tabs>
        <!-- Left-side Drawer -->
        <q-drawer ref="leftDrawer">
            <div class="toolbar">
                <q-toolbar-title>
                    Drawer Title
                </q-toolbar-title>
            </div>
            <div class="list no-border platform-delimiter">
                <q-drawer-link icon="mail" to="/" exact>
                    Mails
                </q-drawer-link>
                <q-drawer-link icon="alarm" to="/clockalarm" exact>
                    Alarm
                </q-drawer-link>
                <q-drawer-link icon="help" to="/help" exact>
                    Help
                </q-drawer-link>
            </div>
        </q-drawer>
        <!-- IF USING subRoutes only: -->
        <router-view class="layout-view"></router-view>
        <!-- OR ELSE, IF NOT USING subRoutes:
        <div class="layout-view"></div>-->
        <!-- Right-side Drawer -->
        <q-drawer ref="rightDrawer" right-side>
            right drawer
        </q-drawer>
        <!-- Footer -->
        <div slot="footer" class="toolbar">
            <span>footer is here</span>
        </div>
    </q-layout>
</template>

<script>
    if(Meteor.isCordova){
        if(cordova.platformId == 'android'){
            import 'quasar-framework/dist/quasar.mat.css';
        }
        else if(cordova.platformId == 'ios'){
            import 'quasar-framework/dist/quasar.ios.css';
        }
    }else{
        //default
        import 'quasar-framework/dist/quasar.mat.css';
    }

</script>

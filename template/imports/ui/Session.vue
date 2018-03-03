<template>
    <div style="text-align: center; margin: 10px;">
        <H5>{{ letsCountText }}</H5>
        <h1>{{ count }}</h1>
        <div><q-progress :percentage="progress" class="positive"></q-progress></div>
        <h2>{{ finished }}</h2>
    </div>
</template>

<script>
    import {Session} from 'meteor/session';

    //swap the comment on these lines if you want to compile for ios
    import { QProgress } from '/node_modules/quasar-framework/dist/quasar.mat.common.js';
    //import { QProgress } from '/node_modules/quasar-framework/dist/quasar.ios.common.js';

    const MAX_COUNT = 3;
    let myInterval;
    export default {
        components: {
            QProgress
        },
        meteor: {
            data: {
                letsCountText() {
                    return 'Let\'s count to ' + MAX_COUNT;
                },
                count() {
                    return Session.get('count');
                },
                finished() {
                    return Session.get('count') === MAX_COUNT ? 'Finished!!' : '';
                },
                progress() {
                    return Session.get('count') * (100 / MAX_COUNT);
                }
            }
        },
        created() {
            Session.set('count', 0);
            let i = 1;
            myInterval =  Meteor.setInterval(function () {
                Session.set('count', i);
                i++;
                if(i > MAX_COUNT){
                    clearInterval(myInterval);
                }
            }, 500);
        },
        destroyed() {
            clearInterval(myInterval);
        }
    }

</script>
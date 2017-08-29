<template>
    <div style="text-align: center;">
        <H5>{{ letsCountText }}</H5>
        <h1>{{ count }}</h1>
        <div><q-progress :percentage="progress" class="positive"></q-progress></div>
        <h2>{{ finished }}</h2>
    </div>
</template>

<script>
    import {Session} from 'meteor/session';
    const MAX_COUNT = 3;
    let myInterval;
    export default {
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
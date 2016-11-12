<template>
        <div style="text-align: center;">
            <H5>Let's count to 5</H5>
            <h1>{{ count }}</h1>
            <div><quasar-progress :percentage="progress" class="positive"></quasar-progress></div>
            <h2>{{ finished }}</h2>
        </div>
</template>

<script>
    import {Session} from 'meteor/session';

    const MAX_COUNT = 5;
    let myInterval;
    export default {
        meteor: {
            data: {
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
                if(i > 5){
                    clearInterval(myInterval);
                }
            }, 1000);
        },
        destroyed() {
            clearInterval(myInterval);
        }
    }

</script>
<template>
        <div style="text-align: center;">
            <div>
                <!-- Regular shaped -->
                <button class="primary" @click="clickMethod()">
                    Add a record
                </button>
            </div>
            <p class="caption">Striped star list</p>
            <div class="list striped">
                <div class="item" v-for="item in starRecords">
                    <div class="item-content">
                        {{ item.name }}
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
    import { Meteor } from 'meteor/meteor';
    import {Stars} from '../lib/collections';

    export default {
        data() {
            return {
                starNames: ['Dog Star', 'Sirius', 'Pole Star', 'Sun', 'Arthur'],
                counter: -1
            }
        },
        meteor: {
            starRecords: {
                params() {
                    return null;
                },
                update () {
                    var starsFound = Stars.find();
                    if(starsFound.count() > this.starNames.length){
                        starsFound.forEach(function(doc, index){
                            Stars.remove({_id: doc._id});
                        });
                        this.counter = -1;
                        alert('starting again ..');
                    }
                    return starsFound;
                }
            }
        },
        methods: {
            clickMethod() {
                if(this.counter < this.starNames.length - 1) {
                    Stars.insert({name: this.starNames[this.getCounter()]});
                }else{
                    alert('There are only five stars')
                }
            },
            getCounter () {
                if(this.counter >= this.starNames.length - 1){
                    console.log('starNames', starNames);
                     return -1;
                }
                this.counter++;
                return this.counter;
            }
        },
        created() {
            this.$subscribe('stars');
        }
    }

</script>
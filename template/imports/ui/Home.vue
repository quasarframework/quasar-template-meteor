<template>
    <div>
        <div style="text-align: center; margin-top: 15px;">
            <q-btn color="primary" @click="clickMethod()">
                Add a record
            </q-btn>
        </div>
        <div style="margin-top: 25px;">
        <q-list striped>
            <q-list-header>Striped star list</q-list-header>
            <q-item v-for="item in starRecords" :key="item._id">
                <q-item-main>
                    {{ item.name }}
                </q-item-main>
            </q-item>
        </q-list>
        </div>
    </div>
</template>

<script>
    import { Meteor } from 'meteor/meteor';
    import { Stars } from '../lib/collections';

    //swap the Comment on these two lines if you want to compile for ios
    import { QList, QListHeader, QBtn, QItem, QItemMain } from '/node_modules/quasar-framework/dist/quasar.mat.esm.js';
    //    import { QList, QListHeader, QBtn, QItem, QItemMain } from '/node_modules/quasar-framework/dist/quasar.ios.esm.js';


    export default {
        data() {
            return {
                starNames: ['Dog Star', 'Sirius', 'Pole Star', 'Sun', 'Arthur'],
                counter: -1
            }
        },
        components: {
            QList,
            QListHeader,
            QBtn,
            QItem,
            QItemMain
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
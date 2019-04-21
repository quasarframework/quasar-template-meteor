<template>
    <div>
        <div style="text-align: center; margin-top: 15px;">
            <q-btn color="primary" @click="clickMethod()">
                Add a record
            </q-btn>
        </div>
        <div style="margin-top: 25px;">
            <q-list bordered separator padding>
                <q-item-label header>List of stars</q-item-label>
                <q-item v-for="item in starRecords" :key="item._id">
                    <q-item>
                        {{ item.name }}
                    </q-item>
                </q-item>
            </q-list>
        </div>
    </div>
</template>

<script>

    import { Stars } from '../lib/collections';

    import {
        QList,
        QListHeader,
        QBtn,
        QItem,
        QItemMain,
        QItemLabel
    } from 'quasar';


    export default {
        data() {
            return {
                starNames: ['Dog Star', 'Pole Star', 'Sun', 'Arthur', 'Elvis'],
                counter: -1
            }
        },
        components: {
            QList,
            QListHeader,
            QBtn,
            QItem,
            QItemMain,
            QItemLabel
        },
        meteor: {
            starRecords: {
                params() {
                    return null;
                },
                update () {
                    var starsFound = Stars.find();
                    if(starsFound.count() > this.starNames.length){
                        this.clearDb(starsFound);
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
                    alert('There are only five stars');
                    this.clearDb(Stars.find());
                }
            },
            clearDb (starsFound) {
                starsFound.forEach(function(doc, index){
                    Stars.remove({_id: doc._id});
                });
                this.counter = -1;
                alert('starting again ..');
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
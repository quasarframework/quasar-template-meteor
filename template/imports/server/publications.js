import { Meteor } from 'meteor/meteor';
import { Stars } from '../lib/collections.js';

Meteor.publish('stars', function(){
    return Stars.find({});
});

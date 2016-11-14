# app-template-meteor
Quasar Starter Kit for Meteor
Drawers edition

This is a resource which will show how to install Quasar inside the Meteor framework, with Vue2 also installed.
First of all, this was forked from **https://github.com/Akryum/meteor-vue2-example-routing**
and then we added Quasar to that. So thanks to Akyrum for making Meteor work with Vue.

###Installation (only desktop works at the moment)

**clone the repository:**

git clone https://github.com/quasarframework/app-template-meteor.git


**Install the stuff from npm (we don't save the node-modules folder in github)**

*meteor npm install --save fastclick moment velocity-animate*

*meteor npm install --save vue vue-router quasar-framework*

*meteor npm install --save babel-runtime meteor-node-stubs*

**run meteor**

*meteor*

———————


You will get some error messages:
[ '- invalid expression: :class="{active: (!mouseModel && model  __v3526c1452685d1042a961c804897cdc640f6cca6cdd471b629fbc6de38756ab7>= index) || (mouseModel && mouseModel >= index)}"' ]
[ '- invalid expression: :class="{incomplete: step  __v06909b10feb6b30b0edd6334bda8e34fa4c548289fce08e7d4a98c73f334ef12> stepper.currentStep}"',
  '- invalid expression: v-show="step  __v06909b10feb6b30b0edd6334bda8e34fa4c548289fce08e7d4a98c73f334ef12>= stepper.currentStep"',
  '- invalid expression: v-if="step  __v06909b10feb6b30b0edd6334bda8e34fa4c548289fce08e7d4a98c73f334ef12> 1"' ]

but these messages don’t prevent the app starting, and have been reported.

Then it should say:
App running at: http://localhost:3000/

Point your desktop browser to that address.

———————

N.B. This is work in progress. (Todays date is 12th November 2016).
We’re working to get Quasar working with Meteor mobile apps as well.

**Problems:**

1) White screen of death appears on mobile when starting the compiled Meteor/Cordova app. (document.body is null on startup).

2) On desktop, if you try to use the mobile simulator in Chrome dev tools, the app is wider than the viewport. Sometimes fiddling with code to produce an update solves this problem, but it seems that some kind of screen refresh needs to be forced here.  

3) In Chrome’s mobile simulator (or when the left and right drawers are hidden) the links in the drawer on the left don’t work properly. The called page flashes for a millisecond and then disappears.


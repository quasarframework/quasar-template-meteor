# app-template-meteor
Quasar Starter Kit for Meteor

(Updated 17th March 2017).

N.B. There is currently a problem Meteor/UglifyJS, which is affecting Quasar. 
I believe this will be resolved by **https://github.com/meteor/meteor/issues/8378**, 
which has already been merged and will be in the next Meteor update.

This is a resource which will show how to install Quasar inside the Meteor framework, with Vue2 also installed.
First of all, this was forked from **https://github.com/Akryum/meteor-vue2-example-routing**
and then we added Quasar to that. So thanks to Akyrum for making Meteor work with Vue.

###Installation 

**clone the repository:**

```
git clone https://github.com/quasarframework/app-template-meteor.git
```

**Install the stuff from npm**

```
meteor npm install
```


**run meteor**

```
meteor
```

———————


You will get some info messages:
```
[ '- invalid expression: v-if="entries  data-v-613f96f4> 0"',
  '- invalid expression: v-if="pagination.rowsPerPage  data-v-613f96f4> 0"' ]
[ '- invalid expression: v-show="rowsSelected  data-v-52670f90> 1"' ]
[ '- invalid expression: :class="{active: (!mouseModel && model  data-v-36ea688f>= index) || (mouseModel && mouseModel >= index)}"' ]
[ '- invalid expression: :class="{incomplete: step  data-v-683ad8fa> stepper.currentStep}"',
  '- invalid expression: v-show="step  data-v-683ad8fa>= stepper.currentStep"',
  '- invalid expression: v-if="step  data-v-683ad8fa> 1"' ]
```

but these messages don’t prevent the app starting, and are being looked at.

Then it should say:
App running at: http://localhost:3000/

Point your desktop browser to that address.

———————

This app is actually made for mobile (both Android and IOS), so it doesn't look up to much on desktop.

Please refer to guide.meteor.com/mobile.html for how to launch mobile apps on IOS and Android.

You can see how it would look by clicking on the mobile phone icon in Chrome Dev Tools.
However I find that I have to force a hot code update, by changing something in the code, before it shows properly.

**Problems:**

1) I've had to copy the Material Design icons and the Roboto font to the /public folder.
There is maybe a better way of doing this.


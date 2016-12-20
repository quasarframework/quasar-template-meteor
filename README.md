# app-template-meteor
Quasar Starter Kit for Meteor

**WORK IN PROGRESS**

(Updated 19th December 2016).

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

This app now also works on mobile as well (apart from a launch script - see solution below in 'Problems').
Please refer to guide.meteor.com/mobile.html for how to launch mobile apps on IOS and Android.

Android works well.

IOS has a couple of problems with the UI due to Safari, which are being worked around as I write,
and will be in version 11.0 of Quasar Framework.

**Problems:**

There's a problem with one of the launch scripts when launching on mobile, which has been solved, and should be in the distribution soon.

However you can correct the script yourself, if you are impatient to see results.

1) Copy node_modules/quasar-framework/dist/quasar.common.js somewhere in case you want to put it back.
2) open the script and look for the phrase **install$2**

change this:

```
function install$2(_Vue) {
  var node = document.createElement('div');
  document.body.appendChild(node);
  toast = new _Vue(Toast$1).$mount(node);
}
```
to this:
```
function install$2(_Vue) {
   Utils.dom.ready(function () {
      var node = document.createElement('div');
      document.body.appendChild(node);
      toast = new _Vue(Toast$1).$mount(node);
  })
}
```
3) Search for the phrase **FastClick.attach**

change this:
```
if (Platform.has.touch) {
  FastClick.attach(document.body);
} 
```
to this:
```
if (Platform.has.touch) {
  Utils.dom.ready(function () {
      var attachFastClick = FastClick;
      attachFastClick(document.body);
  })    
}
```

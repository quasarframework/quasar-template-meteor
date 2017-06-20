![Quasar Framework logo](https://cdn.rawgit.com/quasarframework/quasar-art/863c14bd/dist/svg/quasar-logo-full-inline.svg)

# app-template-meteor
Quasar Starter Kit for Meteor

(Updated 21st March 2017).

Current quasar version 0.13.6

This is a resource which will show how to install Quasar inside the Meteor framework, with Vue2 also installed.
First of all, this was forked from **https://github.com/Akryum/meteor-vue2-example-routing**
and then we added Quasar to that. So thanks to Akyrum for making Meteor work with Vue.

###Installation 

**clone this repository:**

```
git clone https://github.com/quasarframework/app-template-meteor.git
```

**Install from npm**

```
meteor npm install --save
```


**run meteor**

```
meteor
```

———————

Then it should say:
App running at: http://localhost:3000/

Point your desktop browser to that address.

———————

This app is actually made for mobile (both Android and IOS), so it doesn't look up to much on desktop.
You can see how it would look by clicking on the mobile phone icon in Chrome Dev Tools. 
Then change something in the code to make it do a hot-code push, so that the screen updates.

Please refer to guide.meteor.com/mobile.html for how to launch mobile apps on IOS and Android.

**Problems:**

1) I've copied the Material Design icons and the Roboto font to the /public folder.
There may be a better way of doing this.

**How does it work?**

You cannot 'npm install' the quasar-framework in a meteor app, because quasar needs webpack,
and meteor, for simplicity, does not use webpack.

So we have created a quasar folder in /imports, and there we have copied 'quasar.es6.js' from the /dist folder in the npm installation, along with some css files.


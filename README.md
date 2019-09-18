![Quasar Framework logo](https://cdn.rawgit.com/quasarframework/quasar-art/863c14bd/dist/svg/quasar-logo-full-inline.svg)

# quasar-template-meteor
Quasar Starter Kit for Meteor

(Updated 16th September 2019).

#### Quasar 1.1.2

#### Meteor 1.8.1

This is a resource which will show how to install Quasar inside the Meteor framework, with Vue2 also installed.

We have removed akryum:vue-router2 and replaced it with vue-router, because akryum meteor code is not being updated.
This does not seem to have had any repercussions or disadvantages so far.

#### Installation

**clone this repository:**

```
git clone https://github.com/quasarframework/quasar-template-meteor.git
```

**cd into the 'template' folder:**
```
cd quasar-template-meteor/template
```

**Install from npm**

```
meteor npm install
```

**Create a link to quasar in the /imports directory**

```
ln -s ../node_modules/quasar imports

```
(If you are doing this on *Windows* the link command is:
```
mklink /D "imports\quasar" "..\node_modules\quasar\"
```
 - thanks to Noboxulus for working this out)

**Create a link to the quasar-extras .woff files in the /public directory**
This makes the material-icons stuff appear
```
ln -s ../node_modules/@quasar/extras/material-icons/web-font public

```

There is a good explanation on StackOverflow of why there is a problem with the .woff files
https://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts

(If you are doing this on *Windows* the link command is:
```
mklink /D "public\web-font" "..\node_modules\@quasar\extras\material-icons\web-font"
```
 - thanks to Noboxulus)


**run meteor (still inside the template folder)**

```
meteor
```

It should eventually say:
App running at: http://localhost:3000/

Point your desktop browser to that address.

Then if you open Chrome or Firefox dev tools and click on the mobile phone icon you should see this:
![you should see this](mobile.png)

Please refer to guide.meteor.com/mobile.html for how to launch mobile apps on IOS and Android.

Meteor simplifies some of the difficulties of running your app on IOS for development 
(install Xcode, plug your phone into the USB port and call 'meteor run ios-device'), however
registering yourself as an Apple developer and working out how to register your app is a fairly frustrating experience. 

This project uses the Akryum projects to get Meteor working with vuejs and quasar-framework.
The most useful page to consult is:
https://github.com/meteor-vue/vue-meteor-tracker

This is the main page for all the Meteor/Vuejs projects:
https://github.com/meteor-vue/vue-meteor



#### Note:
The 'template' folder is a necessary part of the quasar framework.
However all meteor commands should only be run once you have moved inside the 'template' folder.
This extra 'template' folder is there because quasar-framework requires it. 
However, Quasar-framework uses Webpack for its builds, but Meteor has its own build system.
This means that it is unlikely that you will be able to use *quasar cli*, because it all leads up to a quasar build using webpack.

To use Meteor, just cd into the 'template' folder and run all your usual meteor commands from there.




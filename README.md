![Quasar Framework logo](https://cdn.rawgit.com/quasarframework/quasar-art/863c14bd/dist/svg/quasar-logo-full-inline.svg)

# quasar-template-meteor
Quasar Starter Kit for Meteor

(Updated 28th January 2018).

Quasar 0.14.7

Meteor 1.6.1

This is a resource which will show how to install Quasar inside the Meteor framework, with Vue2 also installed.
First of all, this was forked from **https://github.com/Akryum/meteor-vue2-example-routing**
and then we added Quasar to that. So thankyou to Akryum for making Meteor work with Vue. - Amazing work.

#### Quasar 0.14 now installs with Meteor from npm.

#### Installation

**clone this repository:**

```
git clone https://github.com/quasarframework/quasar-template-meteor.git
```

**cd into the 'template' folder:**
```
cd template
```

**Install from npm**

```
meteor npm install
```
**Then here we transpile an es6 .js file to commonjs which meteor needs**

We hope that in Meteor 1.6.2 we will be able to install without the transpile. 
Fingers crossed....

Do not remove .babelrc.RENAMED. It is necessary for the transpile script.

```
npm run transpile
```


**run meteor (still inside the template folder)**

```
meteor
```

———————

It should eventually say:
App running at: http://localhost:3000/

Point your desktop browser to that address.

Then if you open Chrome or Firefox dev tools and click on the mobile phone icon you should see this:
![you should see this](mobile.png)

Please refer to guide.meteor.com/mobile.html for how to launch mobile apps on IOS and Android.

#### Note:
The 'template' folder is necessary for the *quasar cli* command to function.
All meteor commands however should be run from inside the 'template' folder.

**Problems:**

1) I've had to create symlinks from /node_modules/quasar-extras to the /public folder for the Material Design icons.
There may be a better way of doing this.


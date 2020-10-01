# Jumentix-Vue-UI

> User Interface for JumentiX

### Project Structure
```bash
├── build
├── config (Webpack)
├── src
│   ├── api
│   ├── components
│   ├── mixins
│   ├── pages (or views)
│   ├── router
│   ├── util
│   ├── theme
│   │   ├── default.styl
│   └── App.vue
│   └── event.js
│   └── main.js
├── dist
├── release
├── static (or asset)
├── mock (or script to build mock data)
├── node_modules
├── test
├── README.md
├── package.json
├── index.html
└── .gitignore

### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```


## How to see JumentiX and JumentiX Vue UI in action

1. Install [JumentiX](https://github.com/web2solutions/Jumentix#pre-requisites)
2. Install [JumentiX Vue UI](https://github.com/web2solutions/Jumentix-Vue-UI#project-structure)

´´´bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

´´´ 
3. Reach UI on browser: http://localhost:8080/





## How to use the automated Deploy System?

Once you get the Deploy system installed into your node.js application, you may use npm to deploy your code to the specified server.

***What it does?***

1. commit your local master changes
2. push your local master changes to github
3. Connect to target server via SSH
4. pull master changes from github into the application directory
5. re-install application
6. re-build application
7. re-start application at target server

***Parameters:***

- `--m`

```bash
--m="Commit message Goes here"
```

Where `Commit message Goes here` is your custom commit message.

**Deploying to test passing a custom message to be used when commiting to github**

```bash
$ npm run deploy-test -- --m="first QB integration"

```

Where `Final version` is your custom commit message.

**Deploying to test with default commit message**

```bash
$ npm run deploy-test

```

**Deploying to production passing a custom message to be used when commiting to github**

```bash
$ npm run deploy-production -- --m="Final version"

```

Where `Final version` is your custom commit message.

**Deploying to production with default commit message**

```bash
$ npm run deploy-production

```


-------------

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### Reference

* [Vuetifyjs](https://vuetifyjs.com/)
* [Vue](https://vuejs.org/index.html/)
* [Material Design](http://material.io/)
* [ECharts](http://echarts.baidu.com/option.html)
* [Stylus](http://stylus-lang.com/)


## License


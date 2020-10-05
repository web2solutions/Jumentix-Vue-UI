#   <img src="https://avatars3.githubusercontent.com/u/14809007?s=280&v=4" width="50" />  JumentiX Vue UI

> User Interface for JumentiX

"Runtime" generated VUE User Interfaces by leveraging extended Swagger OpenAPI specification as declarative metadata.

## The scenario

**To create backend and it frontend for "Enterprise web applications".**

On the backend it is common to use a declarative standard to "generate" code and documentation for REST APIs.

A well known declarative standard is the [OpenAPI](https://swagger.io/specification/) specification, used on [Swagger](https://swagger.io/).

Swagger is a set of tools for API development, documentation, testing and more.

>> The OpenAPI Specification, formerly known as the Swagger Specification, is the world’s standard for defining RESTful interfaces. The OAS enables developers to design a technology-agnostic API interface that forms the basis of their API development and consumption.


## The problems

Rather than the back end, where you have a set of tools to automate code and documentation development, the Frontend development still being a intensive manual and long task, due several reasons:

- Data "payloads"

Frontend developers need to pay attention to API documentations and all it deeply details to make sure the "application client" is "composing valid payloads" when sending data to API´s end points.

End point payload may contains vary properties and different data types.

Frontend developers should to validate payloads before sending data to end points. Payloads might be complex and slow to get it validate once the front end developers need to go through every end point documentation and clear understand it resources and data types. This requires manual and thorough work.


- Data "format"

Frontend developers are required to know how backend data looks like to correctly/friendly display it on screens. This requires manual and thorough work.



- Frontend development tends to be longer and harder than Backend development. You probably may need more developers on Frontend rather than the Backend



- "SCRUM based" application development






using standards and [RAD](https://en.wikipedia.org/wiki/Rapid_application_development) methodologies

[RAD](https://en.wikipedia.org/wiki/Rapid_application_development)





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

```bash
# install dependencies
npm install

# serve with hot reload at localhost:3001
npm start
``` 


2. Install [JumentiX Vue UI](https://github.com/web2solutions/Jumentix-Vue-UI#project-structure)

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
``` 

3. Reach UI on browser: http://localhost:8080/




-------------

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### Reference

* [Vuetifyjs](https://vuetifyjs.com/)
* [Vue](https://vuejs.org/index.html/)
* [Material Design](http://material.io/)
* [ECharts](http://echarts.baidu.com/option.html)
* [Stylus](http://stylus-lang.com/)



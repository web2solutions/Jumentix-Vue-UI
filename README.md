#   <img src="https://avatars3.githubusercontent.com/u/14809007?s=280&v=4" width="50" />  JumentiX Vue UI

> User Interface for JumentiX

"Runtime" generated VUE User Interfaces by leveraging extended Swagger OpenAPI specification as declarative metadata.


## Problems

Rather than the back end, where you have a set of tools to automate code and documentation development, the Frontend development still being an intensive manual and long task, due several reasons:

- Data "payloads"

Frontend developers need to pay attention to API documentations and all it deeply details to make sure the "application client" is "composing valid payloads" when sending data to API´s end points.

End point payload may contains vary properties and different data types.

Frontend developers should to validate payloads before sending data to end points. Payloads might be complex and slow to get it validate once the front end developers need to go through every end point documentation and clear understand it resources and data types. This requires manual and thorough work.


- Data "format"

Frontend developers are required to know how backend data looks like to correctly/friendly display it on screens. This requires manual and thorough work.


- Frontend development tends to be longer and harder than Backend development. You probably may need more developers on Frontend rather than the Backend


- "SCRUM based" application development

In the cases where you have a kind of application which should be flexible in terms of frequently adding or removing features you usually need to manually change files in both client and server side. You usually need to change specification files, database models, grids and forms structure to achieve that goal.

- Components setup/configuration

In modern JS SPAs, screens are usually component architecture based. Some known components are grids, forms, form fields, toolbars and others.

Every component setup must match the backend standards in a certain level.

In a single screen you might need to repeatedly to perform several component configuration, always looking to your backend specification.

- Code quality


## Solution

**Employing mainly [RAD](https://en.wikipedia.org/wiki/Rapid_application_development) and DRY methodologies to generate frontend and backend components.**


On the backend it is common to use a declarative standard to "generate" code and documentation for REST APIs.

A well known declarative standard is the [OpenAPI](https://swagger.io/specification/) specification, used on [Swagger](https://swagger.io/).

Swagger is a set of tools for API development, documentation, testing and more.

>> The OpenAPI Specification, formerly known as the Swagger Specification, is the world’s standard for defining RESTful interfaces. The OAS enables developers to design a technology-agnostic API interface that forms the basis of their API development and consumption.






### Project Structure


```bash
├── build
├── config (Webpack)
├── deploy -> application deploy configuration
├── mock
├── src
│   ├── api
│   ├── components
│   │   ├── xCrud -> swagger based automatically generated CRUD (Vuetify)
│   │   ├── xCrud -> swagger based automatically generated CRUD (Vuetify)
│   ├── helpers
│   │   ├── mediator -> Message Mediator && IndexedDB library
│   │   ├── helper.js -> helper functions
│   │   ├── session.js -> client side session implementation
│   │   └── store.js -> Vuex implementation
│   ├── pages
│   │   ├── FinanceCategory -> swagger based automatically generated CRUD (Vuetify)
│   │   ├── MAPForms -> Visual Form Builder (JQWidget)
│   │   ├── Human -> swagger based automatically generated CRUD (JQWidget)
│   │   │   ├── formCreate -> Form screen to create new item
│   │   │   │    ├── events -> functions supporting Screen events
│   │   │   │    ├── Index.vue -> Vue View
│   │   │   │    ├── Index.vm.js -> Vue ViewModel
│   │   │   │    └── toolbarButtons.js -> toolbar configuration
│   │   │   ├── formEdit -> Form screen to edit exiting item
│   │   │   │    ├── events -> functions supporting Screen events
│   │   │   │    ├── Index.vue -> Vue View
│   │   │   │    ├── Index.vm.js -> Vue ViewModel
│   │   │   │    └── toolbarButtons.js -> toolbar configuration
│   │   │   ├── formSchema -> Form screen to create/edit items in a "multiple records" field
│   │   │   │    ├── events -> functions supporting Screen events
│   │   │   │    ├── Index.vue -> Vue View
│   │   │   │    ├── Index.vm.js -> Vue ViewModel
│   │   │   │    └── toolbarButtons.js -> toolbar configuration
│   │   │   └── listing -> Main CRUD screen. Grid, Toolbar
│   │   │   │    ├── events -> functions supporting Screen events
│   │   │   │    ├── RowViewer.js -> Display document data under a grid row
│   │   │   │    ├── SchemaViewer.js -> Display document "multiple records" fields data 
│   │   │   │    ├── View.vue -> Vue View
│   │   │   │    ├── ViewModel.vm.js -> Vue ViewModel
│   │   │   │    └── toolbarButtons.js -> toolbar configuration
│   │   └── User -> swagger based automatically generated CRUD (JQWidget)
│   │   │   ├── formCreate -> Form screen to create new item
│   │   │   │    ├── events -> functions supporting Screen events
│   │   │   │    ├── Index.vue -> Vue View
│   │   │   │    ├── Index.vm.js -> Vue ViewModel
│   │   │   │    └── toolbarButtons.js -> toolbar configuration
│   │   │   ├── formEdit -> Form screen to edit exiting item
│   │   │   │    ├── events -> functions supporting Screen events
│   │   │   │    ├── Index.vue -> Vue View
│   │   │   │    ├── Index.vm.js -> Vue ViewModel
│   │   │   │    └── toolbarButtons.js -> toolbar configuration
│   │   │   ├── formSchema -> Form screen to create/edit items in a "multiple records" field
│   │   │   │    ├── events -> functions supporting Screen events
│   │   │   │    ├── Index.vue -> Vue View
│   │   │   │    ├── Index.vm.js -> Vue ViewModel
│   │   │   │    └── toolbarButtons.js -> toolbar configuration
│   │   │   └── listing -> Main CRUD screen. Grid, Toolbar
│   │   │   │    ├── events -> functions supporting Screen events
│   │   │   │    ├── RowViewer.js -> Display document data under a grid row
│   │   │   │    ├── SchemaViewer.js -> Display document "multiple records" fields data 
│   │   │   │    ├── View.vue -> Vue View
│   │   │   │    ├── ViewModel.vm.js -> Vue ViewModel
│   │   │   │    └── toolbarButtons.js -> toolbar configuration
│   ├── router
│   ├── util
│   ├── App.vue
│   ├── event.js
│   ├── main.js
│   └── Mediator.js -> Mediator implementation
├── static
├── node_modules
├── test
├── README.md
├── package.json
├── Jumentix-Vue-UI.js -> express implementation to serve the static app
├── index.html
└── .gitignore
```


### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

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

3. Reach and Setup the REST API on browser: 

[http://localhost:3001/application/setup](http://localhost:3001/application/setup)


4. Reach UI on browser: 

[http://localhost:8080/](http://localhost:8080/)


5. Do login.

User: agency@agency.com
Password: 123

It is going to ask you to change your password.

6. Swagger based CRUD screen - JQWidget implementation


[http://localhost:8080/#/human](http://localhost:8080/#/human)


7. Swagger based CRUD screen - Vuetify implementation


[http://localhost:8080/#/surveys](http://localhost:8080/#/surveys)



## JQWidgets CRUD screens for *Human Data Entity*

<img src="https://i.imgur.com/IAkTief.png" width="300" /> 

<img src="https://i.imgur.com/jIRR9TZ.png" width="300" /> 

<img src="https://i.imgur.com/QsqWGta.png" width="300" /> 

<img src="https://i.imgur.com/MzFlVes.png" width="300" /> 

<img src="https://i.imgur.com/KVLbSPc.png" width="300" /> 

<img src="https://i.imgur.com/tRNCQDI.png" width="300" /> 

<img src="https://i.imgur.com/la4cTvI.png" width="300" /> 

<img src="https://i.imgur.com/sHpnDee.png" width="300" /> 

<img src="https://i.imgur.com/5uLw0l9.png" width="300" /> 

<img src="https://i.imgur.com/6lwpb7g.png" width="300" /> 

<img src="https://i.imgur.com/xlnmOrL.png" width="300" /> 


### OpenAPI specification for *Human Data Entity*

[Check Human Entity specification on github](https://github.com/web2solutions/Jumentix/blob/master/src/lib/api/swagger/definitions/Human.definition.yaml#L59)


### Frontend "generic component" for  *Human Data Entity*

The generic component is CRUD application which has it components setup in runtime. When you load the screen, it reads a related swagger specification and then use that information to setup the several components configuration.

The following screens have the same codebase, but it differs in terms of what specification is being used as metadata to setup those screen components.

[http://localhost:8080/#/human](http://localhost:8080/#/human)

[http://localhost:8080/#/user](http://localhost:8080/#/user)


#### Code

[https://github.com/web2solutions/Jumentix-Vue-UI/tree/master/src/pages/Human](https://github.com/web2solutions/Jumentix-Vue-UI/tree/master/src/pages/Human)


```bash
├── src
│   ├── pages
│   │   └── User
│   │   │   ├── formCreate -> Form screen to create new item
│   │   │   │    ├── events -> functions supporting Screen events
│   │   │   │    ├── Index.vue -> Vue View
│   │   │   │    ├── Index.vm.js -> Vue ViewModel
│   │   │   │    └── toolbarButtons.js -> toolbar configuration
│   │   │   ├── formEdit -> Form screen to edit exiting item
│   │   │   │    ├── events -> functions supporting Screen events
│   │   │   │    ├── Index.vue -> Vue View
│   │   │   │    ├── Index.vm.js -> Vue ViewModel
│   │   │   │    └── toolbarButtons.js -> toolbar configuration
│   │   │   ├── formSchema -> Form screen to create/edit items in a "multiple records" field
│   │   │   │    ├── events -> functions supporting Screen events
│   │   │   │    ├── Index.vue -> Vue View
│   │   │   │    ├── Index.vm.js -> Vue ViewModel
│   │   │   │    └── toolbarButtons.js -> toolbar configuration
│   │   │   └── listing -> Main CRUD screen. Grid, Toolbar
│   │   │   │    ├── events -> functions supporting Screen events
│   │   │   │    ├── RowViewer.js -> Display document data under a grid row
│   │   │   │    ├── SchemaViewer.js -> Display document "multiple records" fields data 
│   │   │   │    ├── View.vue -> Vue View
│   │   │   │    ├── ViewModel.vm.js -> Vue ViewModel
│   │   │   │    └── toolbarButtons.js -> toolbar configuration
```

## Vuetify CRUD screens

<img src="https://i.imgur.com/MsB0GIg.png" width="300" /> 

<img src="https://i.imgur.com/wCIh3yN.png" width="300" /> 

<img src="https://i.imgur.com/nnc2rAe.png" width="300" /> 

<img src="https://i.imgur.com/NP1LYTv.png" width="300" /> 

<img src="https://i.imgur.com/qindR5B.png" width="300" /> 

<img src="https://i.imgur.com/oOAdU9n.png" width="300" /> 

<img src="https://i.imgur.com/WPMKRP2.png" width="300" /> 



## Code Examples




### Text Field

Following code generates a text field on screen

```yaml
    first_name:
        description: "First Name"
        type: "string"
        example: "Thomas"
        minLength: 2
        x-ui:
          grid:
            hide: false
            label: First name
            width:  "120"
          form:
            hide: false
            label: First name
```

### ComboBox field linked to another collection

Following code generates a combobox field on screen. The data inside the combo is fetched from a IndexedDB collection.

```yaml
    user:
        description: "System Account associated to this Human"
        type: "string"
        example: "5c78a060c15bca840749e44b"
        x-ui:
          collection-link: User
          collection-link-value: _id
          collection-link-label: username
          grid:
            hide: false
            label: User
            width:  "120"
          form:
            type: combobox # select, combobox, text,  radio, checkbox, switch, textarea, autocomplete
            hide: false
            label: User
            selection-limit: 1
```

### Select field linked to another collection

Following code generates a select field on screen. The data inside the select field is fetched from a IndexedDB collection.

```yaml
    user:
        description: "System Account associated to this Human"
        type: "string"
        example: "5c78a060c15bca840749e44b"
        x-ui:
          collection-link: User
          collection-link-value: _id
          collection-link-label: username
          grid:
            hide: false
            label: User
            width:  "120"
          form:
            type: select # select, combobox, text,  radio, checkbox, switch, textarea, autocomplete
            hide: false
            label: User
            selection-limit: 1
```

### Select field listing form defined options

Following code generates a select field on screen. The data inside the select field is "hard coded" into the "x-ui" OpenAPI extended property.

```yaml
    roles:
        type: "array"
        description: The User's role
        default: ["parent"]
        items:
          type: "string"
        x-ui:
          grid:
            hide: false
            label: User's role
            width:  120
          form:
            type: select # select, combobox, text,  radio, checkbox, switch, textarea, autocomplete
            hide: false
            label: User's role
            options: ["admin", "staff", "parent", "child", "agency", "caseworker", "manager"]
            selection-limit: 0
```

Following code generates a select field on screen. The data inside the select field is "hard coded" into the "enum" OpenAPI official property.

### Select field listing enum values

```yaml
    role:
        type: "string"
        enum: ["admin", "staff", "parent", "child", "agency", "caseworker", "manager"]
        description: The User's role
        default: ["parent"]
        items:
          type: "string"
        x-ui:
          grid:
            hide: false
            label: User's role
            width:  120
          form:
            type: select # select, combobox, text,  radio, checkbox, switch, textarea, autocomplete
            hide: false
            label: User's role
            selection-limit: 0
```

### Multi select / listing field linked to a collection

Following code generates a multi select field on screen. The data inside the select field is fetched from a IndexedDB collection.

```yaml
    sub_roles:
        type: "array"
        description: Sub Roles allowed in this Program
        default: []
        items:
          type: "string"
        x-ui:
          collection-link: SubRole
          collection-link-value: _id
          collection-link-label: label
          grid:
            hide: false
            label: Sub Roles
            width:  "17%"
          form:
            type: multipleselect # select, combobox, text,  radio, checkbox, switch, textarea, autocomplete
            hide: false
            label: Sub Roles
            selection-limit: 0
```


### Dependent fields linked to a collection

```yaml
    role:
        type: "string"
        description: "Role  allowed in this Program"
        example: "5c78a060c15bca840749e44b"
        x-ui:
          collection-link: Role
          collection-link-value: _id
          collection-link-label: label
          dependent:
            - targetField: sub_roles
              remoteKey: role
              localKey: _id
          grid:
            hide: false
            label: Role
            width: "83%"
          form:
            type: combo # select, combobox, text,  radio, checkbox, switch, textarea, autocomplete, date, time, grid
            hide: false
            label: Role
            selection-limit: 1
    sub_roles:
        type: "array"
        description: Sub Roles allowed in this Program
        default: []
        items:
          type: "string"
        x-ui:
          collection-link: SubRole
          collection-link-value: _id
          collection-link-label: label
          dependentOf: role
          grid:
            hide: false
            label: Sub Roles
            width:  "17%" # take 20% considering the altrow indicator
          form:
            type: multipleselect # select, combobox, text,  radio, checkbox, switch, textarea, autocomplete
            hide: false
            label: Sub Roles
            selection-limit: 0
```

### Date-Time Field

```yaml
    createdAt:
        description: "Created At"
        type: "string"
        format: "date-time"
        example: "2017-07-21"
        x-ui:
          grid:
            hide: false
            label: Created At
            width:  120
          form:
            type: date-time # select, combobox, text,  radio, checkbox, switch, textarea, autocomplete, date, time, date-time
            hide: false
            label: Created At
```

### Date field

```yaml
    birthDate:
        description: "Birth Date"
        type: "string"
        format: "date"
        #nullable: true
        example: "2017-07-21"
        x-ui:
          grid:
            hide: true
            label: Birth Date
            width:  "120"
          form:
            type: date # select, combobox, text,  radio, checkbox, switch, textarea, autocomplete, date, time
            hide: false
            label: Birth Date
```

### Formated/Validated SSN field

```yaml
    ssn:
        description: "Social Security Number"
        type: "string"
        format: ssn
        example: "000-00-0000"
        x-ui:
          grid:
            hide: false
            label: SSN
            width:  "100"
          form:
            hide: false
            label: SSN
```

### Avatar field

```yaml
    avatar:
        description: "Avatar - It can be the path of a file on CDN or a base64 encoded file. If you provide a base64 image hash it will be saved as file on CDN."
        type: "string"
        format: "base64"
        example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/sdf........"
        x-ui:
          grid:
            hide: true
            label: Avatar
            width:  "*"
          form:
            type: base64
            hide: false
            label: Avatar
            accept: "image/png, image/jpeg"
            file-size: 0.5
            media-type: avatar # avatar, image, document
```

### Single file field

```yaml
    signature:
        description: "Signature - It can be the path of a file on CDN or a base64 encoded file. If you provide a base64 image hash it will be saved as file on CDN."
        type: "string"
        format: "base64"
        example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/sdf........"
        x-ui:
          grid:
            hide: true
            label: Signature
            width:  "120"
          form:
            type: base64
            hide: false
            label: Signature
            accept: "image/png, image/jpeg"
            file-size: 4
            media-type: image # avatar, image, document
```

### Muliple file field

```yaml
    file:
        description: "File attachments"
        type: "array"
        items:
          $ref: "#/definitions/file"
        #default: []
        x-uploader: true
        x-ui:
          grid:
            hide: true
            label: Files
            width:  "*"
          form:
            type: grid # select, combobox, text,  radio, checkbox, switch, textarea, autocomplete, date, time, grid
            hide: false
            label: Files
            isSchema: true
```

### Multidimensional field / Grid linked to a schema

```yaml
    address:
        description: "Addresses"
        type: "array"
        items:
          $ref: "#/definitions/address"
        default: []
        x-ui:
          grid:
            hide: true
            label: Address
            width:  "120"
          form:
            type: grid # select, combobox, text,  radio, checkbox, switch, textarea, autocomplete, date, time, grid
            hide: false
            label: Address
            isSchema: true
```

### Integer field

```yaml
    size:
        description: 'File size'
        type: "integer"
        format: "int32"
        example: 12300
        readOnly: true
        x-editable: false
        x-ui:
          grid:
            hide: false
            label: File Size
            width:  100
          form:
            hide: true
            label: File Size
```

### x-ui available properties:

- `collection-link`

Sets the collection name which will be used to pull data from

- `collection-link-value`

Sets the collection property which will be used as value on Selection/Multi Selection fields

- `collection-link-label`

Sets the collection property which will be used as label on Selection/Multi Selection fields


- `form`

Sets how a property behaves on a form -> Form Field

- `grid`

Sets how a property behaves on a grid -> Grid Column


### form available properties:

- `type`
- `hide`
- `label`
- `isSchema`
- ``



-------------

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### Reference

* [JQWidget](https://www.jqwidgets.com/)
* [Vuetifyjs](https://vuetifyjs.com/)
* [Vue](https://vuejs.org/index.html/)
* [Material Design](http://material.io/)
* [ECharts](http://echarts.baidu.com/option.html)
* [Stylus](http://stylus-lang.com/)



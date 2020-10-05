#   <img src="https://avatars3.githubusercontent.com/u/14809007?s=280&v=4" width="50" />  JumentiX Vue UI

> User Interface for JumentiX

"Runtime" generated VUE User Interfaces by leveraging extended Swagger OpenAPI specification as declarative metadata.

## The scenario

**To create backend and it frontend for "Enterprise offline first web applications".**

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

* [Vuetifyjs](https://vuetifyjs.com/)
* [Vue](https://vuejs.org/index.html/)
* [Material Design](http://material.io/)
* [ECharts](http://echarts.baidu.com/option.html)
* [Stylus](http://stylus-lang.com/)



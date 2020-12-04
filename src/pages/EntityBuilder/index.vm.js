/* global session store $route dhtmlXGridObject, dhtmlXLayoutObject, hljs, ace */
import fromCDN from 'from-cdn'
import Vue from 'Vue'
import OverViewPanel from './components/OverViewPanel'
import FormEntityDataSpec from './components/FormEntityDataSpec'
import FormEntityGuiSpec from './components/FormEntityGuiSpec'
import FormPropertyDataSpec from './components/FormPropertyDataSpec'
import FormPropertyGuiSpec from './components/FormPropertyGuiSpec'
import * as YAML from 'json2yaml'

export default {
  data: () => ({
    wrapperHeight: 0,
    loading: true,
    selected: [],
    dialog: false,
    expand: false,
    snack: false,
    snackColor: '',
    snackText: '',
    search: '',
    entity: 'Human',
    spec: {},
    selectedItem: {}
  }),
  computed: {
    swagger () {
      return this.store.state.swagger
    }
  },
  created () {
    this.ready = fromCDN([
      '//cdn.dhtmlx.com/edge/dhtmlx.js',
      '//cdn.dhtmlx.com/edge/dhtmlx.css'
    ])
  },
  mounted () {
    console.error(this.swagger)

    for (const prop in this.swagger) {
      if (this.swagger.hasOwnProperty(prop)) {
        console.log(this.swagger[prop])
        Vue.set(this.spec, prop, this.swagger[prop])
      }
    }

    this.ready.then(() => {
      this.buildGUI()
      /* this.buildGrid();

      this.getDataFromApi().then(data => {
        this.documents = data.items;
        this.original_documents = [];
        // data.items.forEach(doc => this.documents.push(doc));
        data.items.forEach(doc => this.original_documents.push(doc));
        this.pagination.totalItems = data.total;
      }); */
    })
  },
  beforeRouteLeave (to, from, next) {
    // this.mygrid.destructor()
    next()
  },
  beforeRouteEnter (to, from, next) {
    session.swagger({
      success: response => {
        console.log(response)
        store.commit('setSwagger', response)
        next()
      },
      error: (xhr, ajaxOptions, thrownError) => {
        console.log(thrownError)
        next()
      }
    })
  },
  //
  watch: {

  },
  methods: {
    buildGUI () {
      this.buildLayout()
      this.buildMainStatusBar()
      // this.buildRibbon()
      this.buildTabBuilderPanel()
      this.buildOverviewPanel()
      this.buildTabCode()
      this.buildCodeViewer()
    },
    buildLayout () {
      this.wrapperHeight = this.$refs.xApp.parentNode.offsetHeight - 40
      console.log(this.wrapperHeight)
      this.$refs.container.style.height = `${this.wrapperHeight}px`
      const Layout = dhtmlXLayoutObject
      this.layout = new Layout({
        parent: this.$refs.container, // id/object, parent container for layout
        pattern: '2U', // string, layout's pattern
        cells: [ // optional, cells configuration according to the pattern
          // you can specify only the cells you want to configure
          // all params are optional
          {
            id: 'a', // id of the cell you want to configure
            text: 'Open API / Swagger specification', // header text
            collapsed_text: 'Text 1', // header text for a collapsed cell
            header: true // hide header on init
            // width: 100, // cell init width
            // height: 100, // cell init height
            // collapse: true, // collapse on init
            // fix_size: [true, null] // fix cell's size, [width,height]
          },
          {
            id: 'b', // id of the cell you want to configure
            text: 'Text', // header text
            collapsed_text: 'Text 2', // header text for a collapsed cell
            header: false, // hide header on init
            width: 350 // cell init width
            // height: 100, // cell init height
            // collapse: true, // collapse on init
            // fix_size: [true, null] // fix cell's size, [width,height]
          }
        ]
      })
    },
    buildCodeViewer () {
      // this.layout.cells('a').dhxcont.mainCont.style.overflow = 'scroll'
      this.tabCode.cells('openapi').attachHTMLString(`<div id="yaml" class="yaml">${YAML.stringify(this.spec)}</div>`)
      this.tabCode.cells('selectedItemSpec').attachHTMLString(`<div id="selected_yaml" class="yaml">${YAML.stringify(this.selectedItem)}</div>`)
      /* hljs.configure({ languages: ['yaml'] })

      document.querySelectorAll('pre code ').forEach((block) => {
        hljs.highlightBlock(block)
      }) */
      const editor = ace.edit('yaml')
      // editor.setTheme('ace/theme/monokai')
      editor.session.setMode('ace/mode/yaml')
      this.editor2 = ace.edit('selected_yaml')
      // editor.setTheme('ace/theme/monokai')
      this.editor2.session.setMode('ace/mode/yaml')
    },
    setSelectedYaml (json) {
      this.editor2.setValue(YAML.stringify(json))
    },
    buildRibbon () {
      this.layout.cells('b').attachRibbon()
    },
    buildTabCode () {
      const tabConfig = {
        // skin: 'dhx_skyblue', // string, optional, tabbar skin
        mode: 'top', // string, optional, top or bottom tabs mode
        align: 'left', // string, optional, left or right tabs align
        // close_button: true, // boolean, opt., render Close button on tabs
        content_zone: true, // boolean, opt., enable/disable content zone
        // xml: 'tabbar.xml', // string, optional, path to XML config
        // json: 'tabbar.json', // string, optional, path to JSON config
        onload: function () {}, // function, optional, callback for XML/JSON
        arrows_mode: 'auto', // mode of showing tabs arrows (auto, always)
        tabs: [ // tabs config
          {
            id: 'openapi', // tab id
            text: 'API specification', // tab text
            // width: null, // numeric for tab width or null for auto, optional
            index: 0, // numeric for tab index or null for last position,opt.
            active: true // boolean, make tab active after adding, optional
            // enabled: false, // boolean, false to disable tab on init
            // close: true // boolean, render close button on tab, optional
          }, {
            id: 'selectedItemSpec', // tab id
            text: 'Selected item', // tab text
            // width: null, // numeric for tab width or null for auto, optional
            index: 1 // numeric for tab index or null for last position,opt.
            // active: true, // boolean, make tab active after adding, optional
            // enabled: false, // boolean, false to disable tab on init
            // close: true // boolean, render close button on tab, optional
          }
        ]
      }
      this.tabCode = this.layout.cells('a').attachTabbar(tabConfig)
    },
    buildTabBuilderPanel  () {
      const tabConfig = {
        // skin: 'dhx_skyblue', // string, optional, tabbar skin
        mode: 'top', // string, optional, top or bottom tabs mode
        align: 'left', // string, optional, left or right tabs align
        // close_button: true, // boolean, opt., render Close button on tabs
        content_zone: true, // boolean, opt., enable/disable content zone
        // xml: 'tabbar.xml', // string, optional, path to XML config
        // json: 'tabbar.json', // string, optional, path to JSON config
        onload: function () {}, // function, optional, callback for XML/JSON
        arrows_mode: 'auto', // mode of showing tabs arrows (auto, always)
        tabs: [ // tabs config
          {
            id: 'overViewPanel', // tab id
            text: 'Overview', // tab text
            // width: null, // numeric for tab width or null for auto, optional
            index: 0, // numeric for tab index or null for last position,opt.
            active: true // boolean, make tab active after adding, optional
            // enabled: false, // boolean, false to disable tab on init
            // close: true // boolean, render close button on tab, optional
          }, {
            id: 'openapi', // tab id
            text: 'API Spec', // tab text
            // width: null, // numeric for tab width or null for auto, optional
            index: 1 // numeric for tab index or null for last position,opt.
            // active: true, // boolean, make tab active after adding, optional
            // enabled: false, // boolean, false to disable tab on init
            // close: true // boolean, render close button on tab, optional
          }, {
            id: 'data', // tab id
            text: 'Data Spec', // tab text
            // width: null, // numeric for tab width or null for auto, optional
            index: 2 // numeric for tab index or null for last position,opt.
            // active: true, // boolean, make tab active after adding, optional
            // enabled: false, // boolean, false to disable tab on init
            // close: true // boolean, render close button on tab, optional
          }, {
            id: 'gui', // tab id
            text: 'GUI Spec', // tab text
            // width: null, // numeric for tab width or null for auto, optional
            index: 2 // numeric for tab index or null for last position,opt.
            // active: true, // boolean, make tab active after adding, optional
            // enabled: false, // boolean, false to disable tab on init
            // close: true // boolean, render close button on tab, optional
          }
        ]
      }
      this.tabBuilderPanel = this.layout.cells('b').attachTabbar(tabConfig)
    },
    buildFormEntityDataSpec () {
      this.formEntityDataSpec = new FormEntityDataSpec({
        wrapper: this.tabBuilderPanel.tabs('data')
      })
      this.formEntityDataSpec.render()
    },
    buildFormEntityGuiSpec () {
      this.formEntityGuiSpec = new FormEntityGuiSpec({
        wrapper: this.tabBuilderPanel.tabs('gui')
      })
      this.formEntityGuiSpec.render()
    },
    buildFormPropertyDataSpec () {
      this.formPropertyDataSpec = new FormPropertyDataSpec({
        wrapper: this.tabBuilderPanel.tabs('data'),
        swagger: this.spec
      })
      this.formPropertyDataSpec.render()
    },
    buildFormPropertyGuiSpec () {
      this.formPropertyGuiSpec = new FormPropertyGuiSpec({
        wrapper: this.tabBuilderPanel.tabs('gui'),
        swagger: this.spec
      })
      this.formPropertyGuiSpec.render()
    },
    buildMainStatusBar () {
      this.layout.attachStatusBar()
    },
    buildOverviewPanel () {
      this.overViewPanel = new OverViewPanel({
        wrapper: this.tabBuilderPanel.tabs('overViewPanel'),
        treeBuilderOnSelectItem: this.treeBuilderOnSelectItem
      })
      // this.overViewPanel.render()
      this.overViewPanel.parseTreeData(this.spec)
    },
    treeBuilderOnSelectItem (item) {
      this.setSelectedItem(item.userdata)

      this.tabCode.tabs('selectedItemSpec').setActive()
      // alert('select', item)
    },
    // buildDiagram () { },
    setSelectedItem (item = {}) {
      // this.selectedItem
      Vue.set(this, 'selectedItem', item)
      console.error('--->', this.selectedItem)
      if (this.selectedItem.type === 'entity') {
        this.renderEntityForms()
      } else if (this.selectedItem.type === 'property') {
        this.renderPropertyForms()
      }
      this.setSelectedYaml(this.selectedItem.spec)
    },

    renderEntityForms () {
      console.error('---> renderEntityForms', this.selectedItem)
      this.buildFormEntityDataSpec()
      this.buildFormEntityGuiSpec()
    },

    renderPropertyForms () {
      console.error('---> renderPropertyForms', this.selectedItem)
      this.buildFormPropertyDataSpec()
      this.buildFormPropertyGuiSpec()
    }
  }
}

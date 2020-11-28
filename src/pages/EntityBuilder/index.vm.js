/* global session store $route dhtmlXGridObject, dhtmlXLayoutObject */
import fromCDN from 'from-cdn'

import OverViewPanel from './components/OverViewPanel'

import {
  getEntities,
  getEntityProperties,
  getFormType,
  getGridLabel,
  getGridWidth,
  getGridColAlign,
  isGridHide,
  getFormEditable,
  getFormMask,
  getFormat,
  getFormIsUploader,
  getSchema,
  getFieldCollectionSettings,
  getIconClass
} from '../../helpers/helpers'

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
    entity: 'Human'
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
            text: 'Text', // header text
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
    buildRibbon () {
      this.layout.cells('b').attachRibbon()
    },
    buildTabBuilderPanel () {
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
    buildMainStatusBar () {
      this.layout.attachStatusBar()
    },
    buildOverviewPanel () {
      this.overViewPanel = new OverViewPanel({
        wrapper: this.tabBuilderPanel.tabs('overViewPanel')
      })
      const treeData = []
      this.overViewPanel.render()
      getEntities(this.swagger.definitions).forEach(specOb => treeData.push({
        id: specOb.name,
        text: specOb.name,
        items: getEntityProperties(specOb.spec.properties).map(prop => {
          // console.log(prop)

          let items = []
          const file = getIconClass(prop.spec, prop.name === '_id')
          const type = prop.name === '_id' ? 'oid' : prop.spec.type
          const xuiType = getFormType(prop.spec)
          const text = getGridLabel(prop.spec)
          const mask = getFormMask(prop.spec)
          const format = getFormat(prop.spec)
          const isUploader = getFormIsUploader(prop.spec)
          const schema = getSchema(this.swagger, prop.spec)
          // const collectionSetings = getFieldCollectionSettings(prop.spec)

          console.log({ prop, name: prop.name, type, xuiType, mask, format })
          if (isUploader) {
            console.error(schema)
            items = getEntityProperties(schema.properties).map(subProp => {
              return {
                id: `${subProp.name}__${prop.name}`,
                name: subProp.name,
                text: `${getGridLabel(subProp.spec)}`,
                icons: { file: getIconClass(subProp.spec, subProp.name === '_id') }
              }
            })
          }

          // file: "icon_file",

          return {
            id: `${prop.name}__${specOb.name}`,
            name: prop.name,
            text,
            items,
            icons: { file }
          }
        })
      }))
      // console.log(getEntities(this.swagger.definitions))
      // console.log(treeData)
      this.overViewPanel.parseTreeData(treeData)
    },
    // buildDiagram () { },
    buildGrid () {
      if (this.mygrid) {
        this.mygrid.destructor()
      }
      const Grid = dhtmlXGridObject
      this.mygrid = new Grid(this.$refs.container)
      this.mygrid.setImagesPath('//cdn.dhtmlx.com/5.1/imgs/')

      const headersTitle = []
      const headers = []
      const colWidths = []
      const colAligns = []
      const colTypes = []
      const colSorting = []
      const colIds = []

      for (const property in this.swagger.definitions[this.entity].properties) {
        if (this.swagger.definitions[this.entity].properties.hasOwnProperty(property)) {
          const title = this.swagger.definitions[this.entity].properties[property]['x-label'] || this.swagger.definitions[this.entity].properties[property].description
          const type = this.swagger.definitions[this.entity].properties[property].type
          let hide = false

          if (type === 'string' || type === 'number' || type === 'integer') {
            hide = false
          } else {
            hide = true
          }
          if (this.swagger.definitions[this.entity].properties[property]['x-grid-hide']) {
            hide = true
          }

          console.log(property)
          console.log(this.swagger.definitions[this.entity].properties[property])
          colIds.push(property)
          headersTitle.push(title)
          colWidths.push(hide ? 0 : '*')
          colAligns.push('left')
          colTypes.push('ro')
          colSorting.push(type === 'string' ? 'str' : 'int')
          headers.push('#text_search') // #text_search,#select_filter
        }
      }

      this.mygrid.setHeader(headersTitle.join(','), ',', [])
      this.mygrid.setColumnIds(colIds.join(','))
      this.mygrid.setInitWidths(colWidths.join(','))
      this.mygrid.setColAlign(colAligns.join(','))
      this.mygrid.setColTypes(colTypes.join(','))
      this.mygrid.setColSorting(colSorting.join(','))
      // this.mygrid.attachHeader(headers.join(','));
      this.mygrid.enableAutoHeight(true)
      this.mygrid.enableAutoWidth(true)
      this.mygrid.init()
    }
  }
}

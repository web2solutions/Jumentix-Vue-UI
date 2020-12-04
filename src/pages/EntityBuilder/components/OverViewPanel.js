import {
  getEntities,
  getEntityProperties,
  getFormType,
  getGridLabel,
  // getGridWidth,
  // getGridColAlign,
  // isGridHide,
  // getFormEditable,
  getFormMask,
  getFormat,
  getFormIsUploader,
  getSchema,
  isChild,
  isSchema,
  // getFieldCollectionSettings,
  getIconClass
} from '../../../helpers/helpers'

export default class OverViewPanel {
  constructor ({
    wrapper = null,
    treeBuilderOnSelectItem = () => { }
  }) {
    this.wrapper = wrapper
    this.treeBuilderOnSelectItem = treeBuilderOnSelectItem
    this.treeConfig = {
      // parent: 'treeviewObj', // id/object, container for treeview
      // skin: 'dhx_terrace', // string, optional, treeview's skin
      // iconset: 'font_awesome', // string, optional, sets the font-awesome icons
      // multiselect: true, // boolean, optional, enables multiselect
      // checkboxes: true, // boolean, optional, enables checkboxes
      dnd: true, // boolean, optional, enables drag-and-drop
      context_menu: true, // boolean, optional, enables context menu
      // json: 'filename.json', // string, optional, json file with struct
      // xml: 'filename.xml', // string, optional, xml file with struct
      items: [], // array, optional, array with tree struct
      onload: function () {} // callable, optional, callback for load
    }

    this.tree = null
  }

  buildTree () {
    const self = this
    this.tree = this.wrapper.attachTreeView(this.treeConfig)
    this.tree.attachEvent('onClick', function (id) {
      self.onEntitySelect(id)
    })
  }

  parseTreeData (swagger = {}) {
    const treeData = this.buildData(swagger)
    this.setTreeData(treeData)
    this.destroy()
    this.render(treeData)
  }

  buildData (swagger) {
    const treeData = []
    let entities = getEntities(swagger.definitions)
    entities = entities.sort((a, b) => {
      return /[A-Z]/.test(a.name[0]) ? 1 : -1
    })
    entities.forEach(specOb => treeData.push({
      id: specOb.name,
      text: specOb.name,
      name: specOb.name,
      userdata: { type: isChild(specOb.spec) ? 'schema' : 'entity', spec: specOb },
      type: isChild(specOb.spec) ? 'schema' : 'entity',
      icons: {
        folder_opened: !isChild(specOb.spec) ? 'entity_icon' : 'schema_icon',
        folder_closed: !isChild(specOb.spec) ? 'entity_icon' : 'schema_icon'
      },
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
        const schema = getSchema(swagger, prop.spec)
        // const collectionSetings = getFieldCollectionSettings(prop.spec)

        console.log({
          prop,
          name: prop.name,
          type,
          xuiType,
          mask,
          format
        })
        if (isUploader) {
          console.error(schema)
          items = getEntityProperties(schema.properties).map(subProp => {
            return {
              id: `$$propertyOf_${prop.name}___${subProp.name}`,
              name: subProp.name,
              text: `${getGridLabel(subProp.spec)}`,
              icons: {
                file: getIconClass(subProp.spec, subProp.name === '_id')
              }
            }
          })
        }

        // file: "icon_file",

        return {
          id: `$$propertyOf_${specOb.name}___${prop.name}`,
          name: prop.name,
          text,
          items,
          type: isSchema(prop.spec) ? 'schema' : 'property',
          userdata: { type: isSchema(prop.spec) ? 'schema' : 'property', spec: prop },
          icons: {
            file
          }
        }
      })
    }))
    console.error('treeData', treeData)
    return treeData
  }

  setTreeData (treeData = []) {
    this.treeConfig.items = [{
      id: 'entities',
      name: 'entities',
      text: 'Data Entities',
      open: true,
      icons: {
        file: 'entity_icon',
        folder_opened: 'entity_icon',
        folder_closed: 'entity_icon'
      },
      items: []
    }, {
      id: 'schemas',
      name: 'schemas',
      text: 'Data Schemas',
      open: true,
      icons: {
        file: 'schema_icon',
        folder_opened: 'schema_icon',
        folder_closed: 'schema_icon'
      },
      items: []
    }]
    treeData.forEach(i => {
      if (i.type === 'schema') {
        this.treeConfig.items[1].items.push(i)
      } else if (i.type === 'entity') {
        this.treeConfig.items[0].items.push(i)
      }
    })
  }

  render (swagger = {}) {
    // const treeData = this.buildData(swagger)
    // console.error('======TREE DATA', treeData)
    // this.setTreeData(treeData)
    this.buildTree()
  }

  onEntitySelect (id) {
    const parentId = this.tree.getParentId(id)
    const text = this.tree.getItemText(id)
    const index = this.tree.getLevel(id)
    const subItems = this.tree.getSubItems(id)
    const userdata = this.tree.getUserData(id)
    // const parentId = this.tree.getParentId(id)

    let selectedItemType = 'entity'
    let selectedEntityName = id

    if (id.indexOf('$$propertyOf_') > -1) {
      selectedItemType = 'property'
      selectedEntityName = id.split('___')[1]
    }

    this.treeBuilderOnSelectItem({
      parentId,
      text,
      index,
      subItems,
      selectedItemType,
      selectedEntityName,
      userdata
    })
  }

  destroy () {
    if (this.tree) {
      try {
        this.tree.unload()
      } catch (error) {
        console.log(error)
      }
    }
  }
}

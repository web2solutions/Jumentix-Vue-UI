
export default class OverViewPanel {
  constructor ({
    wrapper = null
  }) {
    this.wrapper = wrapper
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
    this.tree = this.wrapper.attachTreeView(this.treeConfig)
  }

  parseTreeData (treeData = []) {
    this.destroy()
    this.render(treeData)
  }

  setTreeData (treeData = []) {
    this.treeConfig.items = []
    treeData.forEach(i => this.treeConfig.items.push(i))
  }

  render (treeData = []) {
    this.setTreeData(treeData)
    this.buildTree()
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

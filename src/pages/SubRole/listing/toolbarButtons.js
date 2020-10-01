/* global $ */
export function getButtons (self) {
  return [{
    type: 'button',
    icon: 'add', // material icon,
    text: `Add new ${self.entity}`,
    handler: () => self.bus.$emit('toolbarClick', 'add')
  }, {
    type: 'button',
    icon: 'preview', // material icon,
    text: `Preview selected ${self.entity}. Please select an item in the grid first!`,
    handler: () => self.bus.$emit('toolbarClick', 'preview')
  }, {
    type: 'button',
    icon: 'edit', // material icon,
    text: `Edit selected ${self.entity}. Please select an item in the grid first!`,
    handler: () => self.bus.$emit('toolbarClick', 'edit')
  }, {
    type: 'button',
    icon: 'delete', // material icon,
    text: `Soft Delete selected ${self.entity}. Please select an item in the grid first!`,
    handler: () => self.bus.$emit('toolbarClick', 'delete')
  }, {
    type: 'button',
    icon: 'undo', // material icon,
    text: `Restore deleted ${self.entity}. Please select an item in the grid first!`,
    handler: () => self.bus.$emit('toolbarClick', 'restore')
  }, {
    type: 'button',
    icon: 'refresh', // material icon,
    text: 'Reload data',
    handler: () => self.bus.$emit('toolbarClick', 'refresh')
  }, {
    type: 'button',
    icon: 'remove_circle', // material icon,
    text: `Hard Delete selected ${self.entity}. Please select an item in the grid first!`,
    handler: () => self.bus.$emit('toolbarClick', 'delete_hard')
  }, {
    type: 'input',
    icon: 'search', // material icon,
    text: `Type a value to search for ${self.entity}`,
    description: 'This is a simple textual search. For more options please check Advanced Search',
    handler: () => self.bus.$emit('toolbarClick', 'simple_search')
  }, {
    type: 'button',
    icon: 'search', // material icon,
    text: `Click to search for ${self.entity}`,
    handler: () => self.bus.$emit('toolbarClick', 'simple_search')
  }, {
    type: 'button',
    icon: 'save_alt', // material icon,
    text: 'Export to PDF',
    handler: () => self.bus.$emit('toolbarClick', 'export2PDF')
  }, {
    type: 'button',
    icon: 'save_alt', // material icon,
    text: 'Export to Excell',
    handler: () => self.bus.$emit('toolbarClick', 'export2Excel')
  }, {
    type: 'button',
    icon: 'help', // material icon,
    text: 'Help',
    handler: () => self.bus.$emit('toolbarClick', 'help')
  }, {
    type: 'button',
    icon: 'record_voice_over', // material icon,
    text: `Execute voice commands for ${self.entity}`,
    handler: () => self.bus.$emit('toolbarClick', 'voice')
  }

    //
  ]
}

export function generateIcon (iconName, title) {
  const icon = $(`<i aria-hidden='true' class='material-icons'>${iconName}</i>`)
  icon.attr('title', title)
  return icon
}

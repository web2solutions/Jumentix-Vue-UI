/* global $ */
export function getButtons (self) {
  return [
    {
      type: 'button',
      icon: 'arrow_back', // material icon,
      text: 'Back to previous page',
      handler: () => self.bus.$emit('toolbarClick', 'back')
    }, {
      type: 'button',
      icon: 'save', // material icon,
      text: `Save ${self.entity}.`,
      handler: () => self.bus.$emit('toolbarClick', 'save')
    }
    //
  ]
}

export function generateIcon (iconName, title) {
  const icon = $(`<i aria-hidden='true' class='material-icons'>${iconName}</i>`)
  icon.attr('title', title)
  return icon
}

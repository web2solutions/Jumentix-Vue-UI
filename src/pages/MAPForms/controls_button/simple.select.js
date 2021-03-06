const label = 'Simple select input'

export default {
  label,
  name: 'select_input_',
  icon: 'sort',
  selected: false,
  spec: {
    type: 'string',
    format: '',
    description: '',
    example: '',
    minLength: 0,
    maxLength: 0,
    readOnly: false,
    'x-editable': true,
    'x-format': 'none',
    'x-required': false,
    'x-dom': {
      type: 'String',
      required: [false, `${label} is required.`],
      // ref: ''
    },
    'x-ui': {
      'collection-link': false,
      'collection-link-value': false,
      'collection-link-label': false,
      form: {
        type: 'select', // select, combobox, text,  radio, checkbox, switch, textarea, autocomplete, date, time, grid, date-time
        hide: false,
        label,
        'selection-limit': 1,
        options: []
      },
      grid: {
        hide: true,
        label,
        width: 0
      }
    },
  }
}

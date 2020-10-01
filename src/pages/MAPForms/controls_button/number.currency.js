const label = 'Currency input'

export default {
  label,
  name: 'currency_input_',
  icon: 'attach_money',
  selected: false,
  spec: {
    type: 'number',
    format: 'float',
    description: '',
    example: '0.00',
    minLength: 3,
    maxLength: 20,
    readOnly: false,
    'x-editable': true,
    'x-format': 'currency',
    'x-required': false,
    'x-dom': {
      type: 'Number',
      required: [false, `${label} is required.`],
      // ref: ''
    },
    'x-ui': {
      'collection-link': false,
      'collection-link-value': false,
      'collection-link-label': false,
      form: {
        type: 'number', // select, combobox, text,  radio, checkbox, switch, textarea, autocomplete, date, time, grid, date-time, number
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

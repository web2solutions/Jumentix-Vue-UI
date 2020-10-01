/* global $ */
import { getFormHash } from '../../../../helpers/helpers'

export function formChange (event) {
  this.isDirty = true
  // this.form.jqxValidator('validate');
  const definition = this.swagger.definitions[this.entity]
  const hash = getFormHash({ form: this.form, definition, mode: this.mode })
  if (!hash) return
  if (hash[this.itemLabel] && hash[this.itemLabel] !== '') {
    $('#tab_title').html(`<b>New ${this.entity} document:</b> ${hash[this.itemLabel]}`)
  }
}

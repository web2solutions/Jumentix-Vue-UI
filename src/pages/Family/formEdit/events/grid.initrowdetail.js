/* global session $ */
import Vue from 'vue';
// import {  formatRecordBasedOnSwagger, update } from '../../../helpers/helpers';

export function gridInitRowDetail (index, parentElement, gridElement, datarecord) {
  console.log('datarecord', datarecord);
  const _id = datarecord._id;
  const rootElement = $($(parentElement).children()[0]);
  console.log(($(parentElement))[0]);

  $(($(parentElement))[0]).css('zIndex', 500);
  console.log(rootElement);
  if (rootElement === null) return;
  Vue.set(this.rowTab, _id, { rootElement, jqTab: null, jqSplitter: {}});
  
  

  let _tabs = this.rowTab[_id].rootElement.find('._tabs');

  this.schemas.forEach(schema => {
    console.log('schema schema schema', schema);
    let tab = $(`<li>${schema.parentProperty.description}</liv>`);
    tab.appendTo($(_tabs));
    let grid = $(`
      <div id="splitter_${schema.schemaName}" style="z-index: 500; width: 100%; overflow: scroll;">
        <div class="splitter-panel">
            <div style="border: none; width: 100%" id="grid_schema_${schema.schemaName}">
            </div>
        </div>
        <div class="splitter-panel" style="z-index: 500; width: 100%; overflow: scroll;">
            <form id="form_schema_${schema.schemaName}" style="position:absolute; z-index: 500; width: 100%; height: 100%;">
            </form>
        </div>
      </div>
    `);
    grid.appendTo($(this.rowTab[_id].rootElement));
  });

  let jqTab = $(this.rowTab[_id].rootElement).jqxTabs({
    width: '100%',
    height: '100%'
  });
  Vue.set(this.rowTab[_id], 'jqTab', jqTab);
  

  this.schemas.forEach(schema => 
  {
    let jqSplitter = $(`#splitter_${schema.schemaName}`).jqxSplitter(
      { 
        width: '100%', 
        height: '100%',
        orientation: 'horizontal',
        panels: 
        [
          { size: 200 },
          { size: 200 }
        ]
      }
    );

    Vue.set(this.rowTab[_id].jqSplitter, schema.schemaName, jqSplitter);
  });


  this.schemas.forEach(schema => 
  {
    let fields = this.setDataFields(schema.schema.properties, true);

    let data = datarecord[schema.parentName];

    // prepare the data
    let source = {
      datatype: 'array',
      datafields: fields,
      localdata: data,
      updaterow: function (rowid, rowdata, commit) {
        // commit(true);
      }
    };

    let headers = this.setGridHeaders(schema.schema.properties);
    // headers.forEach(header => this.foreignGridColumns[].push(header));
    
    // eslint-disable-next-line
    let dataAdapter = new $.jqx.dataAdapter(source);

    let grid = $(`#grid_schema_${schema.schemaName}`);
    grid.jqxGrid({
      width: '100%',
      // height: 250,
      source: dataAdapter,
      columnsresize: true,
      columns: headers
    });
    console.info(schema);
    
    let template = this.setForeignForm(schema.schemaName);
    template.push({
      align: 'left',
      padding: {
        left: 0,
        top: 5,
        bottom: 5,
        right: 40
      },
      columns: [{
        name: 'new',
        type: 'button',
        text: 'New',
        align: 'left',
        width: 120
      }, {
        name: 'save',
        type: 'button',
        text: 'Save',
        align: 'left',
        width: 120
      }]
    });

    let form = $(`#form_schema_${schema.schemaName}`);
    form.jqxForm({
      template: template,
      // value: sampleValue,
      padding: {
        left: 10,
        top: 10,
        right: 10,
        bottom: 10
      }
    });
    form.on('buttonClick', (event) => {
      // console.log(event.args.name);
      if (event.args.name === 'save')
      {
        let hash = form.val();
        template.forEach(t => {
          console.log(t);
          if (t.type === 'custom')
          {
            let component = form.jqxForm('getComponentByName', t.name);
            let items = component.jqxComboBox('getSelectedItems');
            console.log(items);
            hash[t.name] = items.map(i => {
              return i.value;
            });
          }
        });
        window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}/${_id}`);
        console.log(hash);
      }
      else
      {
        // 
      }
    });
  });
}

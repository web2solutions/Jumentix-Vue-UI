/* global session store $route jsPDF */


/* exports.operators =
{
    // enumns, string, number and date
    'eq': 'eq', //                                              = 'aaa'
    'neq': 'ne', //                                             != 'aaa'
    'isnull': 'eq', //                                          = null
    'isnotnull': 'ne', //                                       != null

    // string
    'contains': 'like', //                                      LIKE '%my_form'
    'doesnotcontain': 'notLike', //                             NOT LIKE '%my_form'
    'isempty': 'eq', //                                         = ''
    'isnotempty': 'ne', //                                      != ''
    'startswith': 'notLike', //                                 NOT LIKE '%my_form'
    'endswith': 'notLike', //                                   NOT LIKE '%my_form'

    // number and date
    'gt': 'gt', //                                              > 3
    'gte': 'gte', //                                            >= 3
    'lt': 'lt', //                                              < 2
    'lte': 'lte', //                                            <= 2
    'between': 'between', //                                    BETWEEN 6 AND 10
    '!between': 'notBetween', //                                BETWEEN 6 AND 10
} */


import Vue from 'vue';
import { ObjectID } from 'bson';
import fromCDN from 'from-cdn';
import Mediator from '../../Mediator';
// import flatpickr from 'flatpickr';
import xGrid from './xGrid.vue';
import xCrudControls from './xCrudControls.vue';
import xForm from './xForm.vue';
import {
  mountRecordBasedOnSwagger,
  mountFieldQuery,
  mountPayloadBasedOnSwagger,
  mountDataForGridBasedOnSawgger,
  setGriHeaders,
  setFormFields,
  getCollection,
  getLocalCollection,
  bus,
  mountDataForGrid,
  mountDataForGridWithId,
  getDataFromApi,
  create,
  update,
  remove,
  restore,
  isIdValid
} from '../../helpers/helpers';
import session from '../../helpers/session';
export default {
  name: 'Human',
  components: {
    xGrid,
    xForm,
    xCrudControls
  },
  data: () => ({
    entity: 'Human',
    itemKey: 'first_name',
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 10, // -1 for All
      totalItems: 0
    },
    operators: {
      items: [
        { text: 'State 1' },
        { text: 'State 2' },
        { text: 'State 3' },
        { text: 'State 4' },
        { text: 'State 5' },
        { text: 'State 6' },
        { text: 'State 7' }
      ],
      all: {
        equal: {
          label: 'Equal'
        },
        contains: {
          label: 'Contains'
        },
        doesNotcontains: {
          label: 'Does not contains'
        },
        isNull: {
          label: 'Is null'
        },
        isNotNull: {
          label: 'Is not null'
        }
      },
      text: {
        isEmpty: {
          label: 'Is empty'
        },
        isNotEmpty: {
          label: 'Is not empty'
        },
        startsWith: {
          label: 'Starts with'
        },
        endsWith: {
          label: 'Ends with'
        },
      }
    },
    query_operators: {
      text: [
        { text: 'Equal', value: 'eq' },
        { text: 'Not equal', value: 'ne' },
        { text: 'Is null', value: 'isNull' },
        { text: 'Is not null', value: 'isNotNull' },
        { text: 'Is empty', value: 'isEmpty' },
        { text: 'Is not empty', value: 'isNotEmpty' },
        { text: 'Contains', value: 'contains' },
        { text: 'Does not contains', value: 'doesNotContains' },
        { text: 'Starts with', value: 'startsWith' },
        { text: 'Ends with', value: 'endsWith' },
      ],
      date_number: [
        { text: 'Equal', value: 'eq' },
        { text: 'Not equal', value: 'ne' },
        { text: 'Is null', value: 'isNull' },
        { text: 'Is not null', value: 'isNotNull' },
        { text: 'Greater than', value: 'gt' },
        { text: 'Greather than and', value: 'gte' },
        { text: 'Lower than', value: 'lt' },
        { text: 'Lower than and', value: 'lte' },
        { text: 'Between', value: 'between' },
        { text: 'Not between', value: 'notBetween' },
      ],
    },
    totalDocuments: 0,
    headers: [],
    collection_links: [],
    loading: true,
    dialog: false,
    dialog_loading: false,
    dialog_create: false,
    dialog2: true,
    documents: [],
    original_documents: [],
    snack: false,
    selected: [],
    snackColor: '',
    snackText: '',
    search: '',
    
    form_search: {
      name: 'search',
      fields: [],
      values: { 
        createdAt: '',
        createdAt_2: '',
        updatedAt: '',
        updatedAt_2: '',
      },
      user_values: {
        createdAt: '',
        createdAt_2: '',
        updatedAt: '',
        updatedAt_2: '',
      },
      operators: { 
        createdAt: '',
        createdAt_2: '',
        updatedAt: '',
        updatedAt_2: '',
      },
      matching_operator: 'or',
      headers: { },
      defaultItem: { },
      newItem: { },
      dialog: false,
      editedIndex: -1,
      valid: false,
                                                      
    },
    forms: {
      crud: {
        name: 'crud',
        fields: [],
        values: { },
        user_values: { },
        headers: { },
        defaultItem: { },
        newItem: { },
        dialog: false,
        editedIndex: -1,
        valid: false,                                      
      }
    },
  }),
  computed: {
    swagger () {
      return this.store.state.swagger;
    }
  },
  created: function () {
    this.ready = fromCDN([
      '//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js'
    ]);
  },
  mounted () {
    let scope = this;
    let properties = this.swagger.definitions[this.entity].properties;
    setGriHeaders(this, properties);
    setFormFields(this);

    Mediator.client.on('data:sync', async (eventObj) => {
      if (!eventObj.success) return;

      if (eventObj.entity !== this.entity) return;

      if (eventObj.action === 'create')
      {
        scope.addNewDocumentToVm(eventObj.data);
      }
      else if (eventObj.action === 'update' || eventObj.action === 'restore' || eventObj.action === 'delete')
      {
        let { document, index } = scope.getDocumentById(eventObj.data._id);
        if (document)
        {
          // scope.feedGrid();
          scope.updateDocumentOnVm(eventObj.data, index);
        }
      }
      else if (eventObj.action === 'delete_hard')
      {
        let { document, index } = this.getDocumentById(eventObj.data._id);
        if (document)
        {
          // scope.feedGrid();
          scope.deleteDocumentOnVm(document, index);
        }
      }
    });
    

    bus.$on('editCRUDItem', (item) => this.editItem(item));
    bus.$on('previewCRUDItem', (item) => this.previewItem(item));
    bus.$on('feedGrid', () => this.feedGrid());
    bus.$on('setPagination', (pagination) => { this.pagination = Object.assign({}, pagination) });
    // bus.$on('setDialogCreate', () => { this.dialog_create = !this.dialog_create });

    bus.$on('toggleAll', () => { 
      this.toggleAll();
    });

    bus.$on('export2PDF', () => { 
      let JSPDF = jsPDF;
      let doc = new JSPDF('landscape', 'pt', 'a4');
      console.log(document.getElementById('grid_data').childNodes[0].childNodes[0]);
      doc.addHTML(document.getElementById('grid_data').childNodes[0].childNodes[0], function () {
        doc.save('MAP_' + scope.entity + '_QuickReport_' + (new ObjectID()) + '.pdf');
      });

      /** pdf.html(document.body, {
        callback: function (pdf) {
          let iframe = document.createElement('iframe');
          iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:500px');
          document.body.appendChild(iframe);
          iframe.src = pdf.output('datauristring');
        }
      });  */
    });

    bus.$on('export2Excel', () => { 
      let tab_text = '<table border="2px"><tr bgcolor="#87AFC6">';
      let textRange; 
      let j = 0;
      let tab = document.getElementById('grid_data').childNodes[0].childNodes[0]; // id of table
      for (let j = 0; j < tab.rows.length; j++) 
      {     
        tab_text = tab_text + tab.rows[j].innerHTML + '</tr>';
        // tab_text=tab_text+"</tr>";
      }

      tab_text = tab_text + '</table>';
      tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ''); // remove if u want links in your table
      tab_text = tab_text.replace(/<img[^>]*>/gi, ''); // remove if u want images in your table
      tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ''); // reomves input params
      tab_text = tab_text.replace(/<i[^>]*>|<\/i>/gi, ''); // reomves input params
      tab_text = tab_text.replace(/<div[^>]*>|<\/div>/gi, ''); // reomves input params
      tab_text = tab_text.replace(/check_box_outline_blank/gi, ''); // reomves input params
      tab_text = tab_text.replace(/arrow_upward/gi, ''); // reomves input params
      
      

      // let ua = window.navigator.userAgent;
      // let msie = ua.indexOf("MSIE "); 

      let sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));// other browser not tested on IE 11
         

      return sa; 
    });

    bus.$on('toggleOne', (item) => { 
      this.toggleOne(item);
    });

    bus.$on('saveSubForm', async (name) => { 
      let { data, error } = await this.saveSubForm(name);
      if (error) return;
      bus.$emit('setSubFormDialog', name);
    });

    bus.$on('setSubFormDialog', async (name) => { 
      // console.log('setSubFormDialog', name);
      this.forms[name].dialog = !this.forms[name].dialog;
      // if close window
      if (this.forms[name].dialog)
      {
        await this.feedFieldsValues(name);
        // console.log('actual values', this.forms[name].user_values);
        // console.log('default value', this.forms[name].defaultItem);
      }
      else
      {

        // console.log('actual values', this.forms[name].user_values);
        // console.log('default value', this.forms[name].defaultItem);
        this.forms[name].user_values = Object.assign({}, this.forms[name].defaultItem);
        this.forms[name].editedIndex = -1;
        this.clearFieldsValues(name);
      }


    });
    
    bus.$on('editSubFormItem', (item, formName) => { 
      this.editSubFormItem(item, formName);
    });

    bus.$on('clearFieldsValues', (formName) => { 
      this.clearFieldsValues(formName);
    });

    bus.$on('setDialog', async () => { 
      this.forms.crud.dialog = !this.forms.crud.dialog;
      if (this.forms.crud.dialog)
      {
        this.dialog_loading = true;
        this.loading = true;
        await this.feedFieldsValues('crud');
        this.dialog_loading = false;
        this.loading = false;
      }
    });

    bus.$on('setDialogSearch', async () => { 
      this.form_search.dialog = !this.form_search.dialog;
      if (this.form_search.dialog)
      {
        this.dialog_loading = true;
        // this.loading = true;
        await this.feedFieldsValues('crud', true);
        this.dialog_loading = false;
        // this.loading = false;
      }
      else
      {
        this.clearFieldsValues('crud');
      }
    });

    bus.$on('save', () => this.save());
    bus.$on('close', () => this.close());
    bus.$on('deleteItem', async (item = false) => { 
      await this.deleteItem(item);
    });
    bus.$on('hardDeleteItem', async (item = false) => { 
      await this.deleteItem(item, 'hard');
    });
    bus.$on('restoreItem', async (item = false) => { 
      await this.restoreItem(item);
    });

    /** $and: [
          { $or: [
            {a: 1}, 
            {b: 1}
          ] }
        ] */
    bus.$on('doAdvancedSearch', (value) => {
      let objValues = JSON.parse(JSON.stringify(this.form_search.user_values));
      let objOperators = JSON.parse(JSON.stringify(this.form_search.operators));
      let logicalOperator = '$' + this.form_search.matching_operator;
      let queryObj = {};
      let innerQuery = {};
      innerQuery[logicalOperator] = [];
      
      delete objValues._id;
      delete objOperators._id;

      for (let property in objValues)
      {
        if (objValues.hasOwnProperty(property))
        {
          let objQuery = mountFieldQuery(objValues, objOperators, property, innerQuery, logicalOperator);
          innerQuery = objQuery.innerQuery;
        }
      }

      queryObj = {
        $and: [innerQuery]
      };
      console.log(queryObj);
      if (queryObj.$and[0])
      {
        if (queryObj.$and[0][logicalOperator])
        {
          if (queryObj.$and[0][logicalOperator].length > 0)
          {
            console.log(queryObj);
            this.feedGrid(queryObj);
            this.form_search.dialog = false;
            this.clearFieldsValues('search');
            return;
          }
        }
      }
      this.feedGrid();
      this.form_search.dialog = false;
      this.clearFieldsValues('search');
    });

    bus.$on('doTextSearch', (value) => {
      if (value === '')
      {
        this.feedGrid();
      }
      else
      {
        this.feedGrid({ '$text': { '$search': value }});
      }
    });

    
  },
  beforeRouteEnter (to, from, next) {
    if (!session.isOnline())
    {
      // return;
      next({ path: '/login' });
    }
    else
    {
      next();
    }
  },
  watch: {
    pagination: {
      handler () {
        // // console.log('triggered pagination in human.vm');
        this.selected = [];
        this.feedGrid();
      },
      deep: true
    }
  },
  methods: {
    bus () {
      return bus;
    },
    editItem (index) {
      // console.log('this.original_documents[index]', this.original_documents[index]);
      let item = mountRecordBasedOnSwagger(this, this.original_documents[index]);
      // console.log('item', item);
      this.forms.crud.editedIndex = index;
      console.log('editItem', item);
      this.forms.crud.user_values = Object.assign({}, item);
      
      bus.$emit('setDialog');
    },
    previewItem (index) {
      // console.log('this.original_documents[index]', this.original_documents[index]);
      let item = mountRecordBasedOnSwagger(this, this.original_documents[index]);
      // console.log('item', item);
      this.forms.crud.editedIndex = index;
      console.log('editItem', item);
      this.forms.crud.user_values = Object.assign({}, item);
    },
    editSubFormItem (item, formName) {
      bus.$emit('setSubFormDialog', formName);

      this.forms[formName].editedIndex = this.forms.crud.values[formName].indexOf(item);
      console.log('editSubFormItem item', item);
      this.forms[formName].user_values = Object.assign({}, item);
      
    },
    close () {
      bus.$emit('setDialog');
      setTimeout(() => {
        this.forms.crud.user_values = Object.assign({}, this.forms.crud.defaultItem);
        this.forms.crud.editedIndex = -1;
      }, 300);
    },

  
    async updateRecord () {
      let formatedRecord = mountPayloadBasedOnSwagger(this, this.entity, this.forms.crud.user_values);
      console.log('formatedRecord', formatedRecord);
      let { data, error } = await update(this.entity, formatedRecord, this.forms.crud.user_values._id);
      if (error)
      {
        console.error('error on update', error);
        return { data, error };
      }
      return { data, error };
    },
    async createRecord () {
      // create
      let formatedRecord = mountPayloadBasedOnSwagger(this, this.entity, this.forms.crud.user_values);
      console.log('formatedRecord', formatedRecord);
      let { data, error } = await create(this.entity, formatedRecord);
      if (error)
      {
        console.error('error on create', error);
        return { data, error };
      }
      
      // this.documents = mountDataForGridBasedOnSawgger(this.swagger, this.entity, this.headers, this.documents);
      return { data, error };
    },
    
    async save () {
      const vForm = this.$refs.xForm.$refs['form_crud'];
      if (vForm.validate())
      {
        await this.processForm();
      }
      else
      {
        this.showSnack('Please check the form');
      }
    },

    async processForm () 
    {
      if (this.forms.crud.editedIndex > -1) 
      {
        await this.updateDocument();
      } 
      else 
      {
        await this.createDocument();
      }
    },

    async updateDocument () {
      let { data, error } = await this.updateRecord();
      let errorMessage = false;
      if (!error) 
      {
        // this.updateDocumentOnVm(data);
        this.feedGrid();
      }
      else
      {
        errorMessage = error.message || error;
      }
      if (!errorMessage) this.close();
      this.showSnack(errorMessage);
    },

    async createDocument () {
      let { data, error } = await this.createRecord();
      let errorMessage = false;
      if (!error) 
      {
        // this.addNewDocumentToVm(data);
        this.feedGrid();
      }
      else
      {
        errorMessage = error.message || error;
      }
      if (!errorMessage) this.close();
      this.showSnack(errorMessage);
    },

    addNewDocumentToVm (data) {
      this.selected = [];
      let newDocument = {};
      for (let prop in this.swagger.definitions[this.entity].properties) {
        if (this.swagger.definitions[this.entity].properties.hasOwnProperty(prop)) {
          let property = this.swagger.definitions[this.entity].properties[prop];
          if (property.type === 'string' || property.type === 'number') {
            newDocument[prop] = data[prop];
          }
        }
      }
      this.documents.unshift(mountDataForGridBasedOnSawgger(this.swagger, this.entity, this.headers, [data])[0]);
      this.original_documents.unshift(data);
    },

    updateDocumentOnVm (data, index) {
      /** this.selected = this.selected.filter(d => { 
        if (d._id === data._id)
        {
          return false;
        }
        else
        {
          return true;
        }
      }); */
      Object.assign(this.documents[index], mountDataForGridBasedOnSawgger(this.swagger, this.entity, this.headers, [data])[0]);
      Object.assign(this.original_documents[index], data);
    },

    deleteDocumentOnVm (data, index) {
      /** this.selected = this.selected.filter(d => { 
        if (d._id === data._id)
        {
          return false;
        }
        else
        {
          return true;
        }
      }); */
      this.documents.splice(index, 1);
      this.original_documents.splice(index, 1);
    },
    
    getFormSubDocumentId (values, index) {
      if (index === -1) return 0;
      let document = values[index];
      // console.log(document);
      return document._id || false;
    },

    getDocumentById (_id = false) {
      let response = {
        document: false,
        index: -1
      };

      if (_id === false) return response;
       
      this.documents.forEach((d, index) => {
        if (d._id === _id)
        {
          response.document = d;
          response.index = index;
        }
      });
      return response;
    },

    showSnack (errorMessage = false, message = 'Data saved') {
      this.snack = true;
      this.snackColor = errorMessage ? 'error' : 'success';
      this.snackText = errorMessage ? errorMessage : message;
    },

    async createSubRecordOnServer (entity, newRecord) {
      let errorMessage = false;
      let formatedRecord = mountPayloadBasedOnSwagger(this, entity, newRecord);
      console.log('formatedRecord', formatedRecord);
      const { data, error } = await create(entity, formatedRecord);
      if (error) {
        errorMessage = error;
        if (error.message) errorMessage = error.message;
      }
      console.log('reateSubRecordOnServer');
      console.log(data, error);
      this.showSnack(errorMessage);
      return { data, error };
    },

    async createSubRecord (formName, parentField, newRecord) {
      let oldArray = JSON.parse(JSON.stringify(this.forms.crud.values[formName]));
      let _data = null;
      let _error = null;
      if (parentField.$collection) {
        // save on server
        const entity = parentField.$collection.collection;
        let { data, error } = await this.createSubRecordOnServer(entity, newRecord);
        if (error) {
          _error = error;
        } else {
          newRecord = data;
          if (parentField.$collection.labelKey && parentField.$collection.valueKey) {
            newRecord = {};
            let keys = parentField.$collection.labelKey.split(',');
            let text = '';
            keys.forEach(k => { text += ' ' + data[k.toString().trim()].toString().trim() });
            newRecord.text = text.toString().trim();
            newRecord.value = data[parentField.$collection.valueKey];
          }
          oldArray.push(newRecord);
          Vue.set(this.forms.crud.values, formName, []);
          Vue.set(this.forms.crud.values, formName, oldArray);
          Vue.set(this.forms.crud.user_values, formName, []);
          Vue.set(this.forms.crud.user_values, formName, oldArray);
    
          _data = newRecord;
        }
      } else {
        const _id = new ObjectID();
        newRecord._id = _id.toString();
        oldArray.push(newRecord);
        Vue.set(this.forms.crud.values, formName, []);
        Vue.set(this.forms.crud.values, formName, oldArray);
        Vue.set(this.forms.crud.user_values, formName, []);
        Vue.set(this.forms.crud.user_values, formName, oldArray);
        
        _data = newRecord;

        this.showSnack();
      }
      return { $data: _data, $error: _error };
    },

    async updateSubRecord (formName, parentField, newRecord, parentFormEditedIndex) {
      let oldArray = JSON.parse(JSON.stringify(this.forms.crud.values[formName]));
      let _data = null;
      let _error = null;
      if (parentField.$collection) {
        // save on server
        
      } else {
        let oldArray = JSON.parse(JSON.stringify(this.forms.crud.values[formName]));
        oldArray.splice(parentFormEditedIndex, 1);
        oldArray.push(newRecord);

        // console.log('oldArray', oldArray);

        Vue.set(this.forms.crud.values, formName, []);
        Vue.set(this.forms.crud.values, formName, oldArray);
        Vue.set(this.forms.crud.user_values, formName, []);
        Vue.set(this.forms.crud.user_values, formName, oldArray);
        
        _data = newRecord;

        this.showSnack();
      }
      return { $data: _data, $error: _error };
    },

    async persistSubForm (formName, parentField, vmForm) {
      const parentFormEditedIndex = vmForm.editedIndex;
      let newRecord = JSON.parse(JSON.stringify(vmForm.user_values));
      let response = {};
      if (parentFormEditedIndex === -1) 
      {
        response = await this.createSubRecord(formName, parentField, newRecord);
      } else // update
      {
        response = await this.updateSubRecord(formName, parentField, newRecord, parentFormEditedIndex);
      }
      return response;
    },
    async saveSubForm (formName) {
      const vForm = this.$refs.xForm.$refs['form_' + formName][0];
      const vmForm = this.forms[formName];
      const parentField = this.forms.crud.fields.filter(field => { return field.id === formName })[0];
      
      if (!vForm.validate())
      {
        this.showSnack('Please check the form');
        return { data: [], error: 'Please check the form' };
      }

      let { $error, $data } = await this.persistSubForm(formName, parentField, vmForm);
      console.log('saveSubForm');
      console.log($error, $data);
      return { data: $data, error: $error };
    },
    async deleteItem (item = false, mode = 'soft') {
      let errors = [];
      let deleted = [];
      if (confirm('Are you sure you want to delete the selected items?' + (mode === 'hard' ? '\nDanger: It can not be reverted!' : ''))) {
        if (item) {
          if (isIdValid(item._id))
          {
            let { error, data } = await remove(this.entity, item._id, mode);
            if (error)
            {
              errors.push(error);
              this.showSnack(this.entity + ' ' + item._id + ' is not deleted');
            } 
            else if (data)
            {
              deleted.push(data);
              this.showSnack(false, this.entity + ' ' + item._id + ' is deleted');
              this.feedGrid();
            }
          }
          else
          {
            errors.push('invalid ID');
            this.showSnack(this.entity + ' is not deleted. Invalid ID');
          }
          /**  */
        } else {
          console.log(this.selected);
          for (let x = 0; x < this.selected.length; x++) {
            let item = this.selected[x];
            if (isIdValid(item._id))
            {
              let { error, data } = await remove(this.entity, item._id, mode);
              if (error)
              {
                errors.push(error);
                this.showSnack(this.entity + ' ' + item._id + ' is not deleted');
              } 
              else if (data)
              {
                deleted.push(data);
                this.showSnack(false, this.entity + ' ' + item._id + ' is deleted');
              }
            }
            else
            {
              errors.push('invalid ID');
              this.showSnack(this.entity + ' is not deleted. Invalid ID');
            }
          }
          if (deleted.length > 0) this.feedGrid();
        }
        return { error: errors, data: deleted };
      }
    },

    async restoreItem (item = false) {
      let errors = [];
      let restored = [];
      if (confirm('Are you sure you want to restore the selected items?')) {
        if (item) {
          if (isIdValid(item._id))
          {
            let { error, data } = await restore(this.entity, item._id);
            if (error)
            {
              errors.push(error);
              this.showSnack(this.entity + ' ' + item._id + ' is not restored');
            } 
            else if (data)
            {
              restored.push(data);
              this.showSnack(false, this.entity + ' ' + item._id + ' is restored');
              this.feedGrid();
            }
          }
          else
          {
            errors.push('invalid ID');
            this.showSnack(this.entity + ' is not restored. Invalid ID');
          }
          /**  */
        } else {
          console.log(this.selected);
          for (let x = 0; x < this.selected.length; x++) {
            let item = this.selected[x];
            if (isIdValid(item._id))
            {
              let { error, data } = await restore(this.entity, item._id);
              if (error)
              {
                errors.push(error);
                this.showSnack(this.entity + ' ' + item._id + ' is not restored');
              } 
              else if (data)
              {
                restored.push(data);
                this.showSnack(false, this.entity + ' ' + item._id + ' is restored');
              }
            }
            else
            {
              errors.push('invalid ID');
              this.showSnack(this.entity + ' is not restored. Invalid ID');
            }
          }
          if (restored.length > 0) this.feedGrid();
        }
        return { error: errors, data: restored };
      }
    },
    
    feedGrid (where = false) {
      (async () => {
        let { allData, data, total, error } = await getDataFromApi(this.entity, this, where);
        if (error)
        {
          console.error(error);
          return;
        }
        this.original_documents = allData;
        this.totalDocuments = total;
        this.documents = mountDataForGridBasedOnSawgger(this.swagger, this.entity, this.headers, data);
      })();
    },

    log (e) {
      // console.log(e.currentTarget);
      // console.log(e);
    },
    toggleAll () {
      if (this.selected.length) {
        this.selected = [];
      } else {
        this.selected = this.documents.slice();
      }
    },
    toggleOne (item) {
      // console.log(item);
      // console.log(this.selected.indexOf(item));
      if (this.selected.indexOf(item) > -1) {
        this.selected.splice(this.selected.indexOf(item), 1);
      } else {
        this.selected.push(item);
      }
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },

    // MUST READ FROM LOCAL CACHE INSTEAD FETCHING END POINT
    async setFieldOptions (field, formName) {
      // console.log('setFieldOptions');
      // console.log(field, formName);
      let { error, data } = await getLocalCollection(field.collection.collection);
      data = data.map(doc => {
        let keys = field.collection.labelKey.split(',');
        let text = '';
        keys.forEach(k => { text += ' ' + doc[k.toString().trim()].toString().trim() });
        return {
          text: text,
          value: doc[field.collection.valueKey]
        };
      });
      if (error) {
        console.error(error);
        Vue.set(this.forms[formName].values, field.id, []);
      } else {
        Vue.set(this.forms[formName].values, field.id, data);
      }
    },
    async setFieldGridValues (field, formName) {
      if (this.forms.crud.editedIndex > -1) {
        
        let fieldRecords = this.original_documents[this.forms.crud.editedIndex][field.id];
        let fieldHeaders = this.forms[formName].headers[field.id];
        Vue.set(this.forms[formName].values, field.id, mountDataForGrid(fieldHeaders, fieldRecords));
        // console.log(this.forms[formName].values[field.id]);
      } else {
        Vue.set(this.forms[formName].values, field.id, []);
      }
    },
    // set the values of a field
    async feedFieldValues (field, formName, isSearch) {
      // console.log('feedFieldValues');
      // console.log('formName', formName);
      // console.log(field, field.id + ' ' + field.type);
      if (field.collection) {
        await this.setFieldOptions(field, formName);
      }

      if (field.type === 'grid') {
        await this.setFieldGridValues(field, formName);
      }

      if (field.type === 'date' || field.type === 'date-time') {
      //   flatpickr(`#${field.id}`, {});
        bus.$emit('mountPicker', field, formName, this.forms[formName].user_values, isSearch);
      }
      // if is a schema
    },
    // reads all fields and set it values
    async feedFieldsValues (formName, isSearch = false) 
    {
      for (let x = 0; x < this.forms[formName].fields.length; x++) {
        let field = this.forms[formName].fields[x];
        await this.feedFieldValues(field, formName, isSearch);
      }
    },

    clearFieldValues (field, formName) {
      let vmForm = this.form_search;
      if (formName !== 'search')
      {
        vmForm = this.forms[formName];
      }

      if (field.type === 'date' || field.type === 'date-time') {
      //   flatpickr(`#${field.id}`, {});
        bus.$emit('clearPicker', field, formName);
        vmForm.user_values[field.id] = null;
      }
      else
      {
        // vmForm.user_values[field.id] = '';
      }
    },
    clearFieldsValues (formName) 
    {
      let vmForm = this.form_search;
      if (formName !== 'search')
      {
        vmForm = this.forms[formName];
      }
      for (let x = 0; x < vmForm.fields.length; x++) {
        let field = vmForm.fields[x];
        this.clearFieldValues(field, formName);
      }
    },

    /** Reads all form fields and identify 
     * the fields that have a associated collection name */
    async getFieldsRelatedCollections () {
      console.log('XXXXXXXXXXXXXXX getFieldsRelatedCollections ');
      for (let formName in this.forms) {
        if (this.forms.hasOwnProperty(formName)) {
          for (let x = 0; x < this.forms[formName].fields.length; x++) {
            let field = this.forms[formName].fields[x];
            if (field.collection) {
              await this.getFieldRelatedCollection(field, formName);
            }
          }
        }
      }
    },

    /** Fetches the specific end point related to a specific collection.
     * save data on local cache
     * set UI model
     */
    async getFieldRelatedCollection (field, formName) {
      console.log(field.id, formName);
      let { error, data } = await getLocalCollection(field.collection.collection);
      if (error) {
        console.error(error);
        Vue.set(this.forms[formName].values, field.id, []);
      } else {
        Vue.set(this.forms[formName].values, field.id, data);
      }
    },
  }
};

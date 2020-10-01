/* global session store $route */
import { setFormFields, getGridWidth, getFormType, getGridColAlign, getOnLocalCollection } from '../../../../helpers/helpers';
import session from '../../../../helpers/session';
import xFormGrid from './xFormGrid.vue';
import UploadButton from './../../../../components/UploadButton.vue';
export default {
  name: 'xGrid',
  props: ['currentFormMode', 'forms', 'dialog', 'entity', 'selected', 'totalDocuments', 'headers', 'original_documents', 'documents', 'loading', 'itemKey', 'bus', 'displayWhat', 'query'],
  components: {
    xFormGrid,
    'upload-btn': UploadButton
    // flatPickr
  },
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 10, // -1 for All
      totalItems: 0
    },
    expand: false
  }),
  computed: {
    swagger () {
      return this.store.state.swagger;
    }
  },
  watch: {
    pagination: {
      handler () {
        console.log('triggered pagination in grid.vm');
        this.bus.$emit('setPagination', this.pagination);
      },
      deep: true
    }
  },
  created () {
    // this.getAll ();
  },
  mounted () {
    console.log('XGRID MOUNTED');
    this.bus.$emit('feedGrid');
    console.log(this.query);
    // console.log(this.forms.crud.values);
    // console.log(this.forms.crud.headers);
  },
  methods: {
    editItem (item) {
      this.bus.$emit('editCRUDItem', item);
      console.log(item);
    },
    deleteItem (item) {
      this.bus.$emit('deleteItem', item);
    },
    close () {
      // console.log(e);
      // this.expand = false;
      this.bus.$emit('close');
    },
    log (e) {
      // ...
    },
    uploadBase64: function (file, fieldId) {
      let reader  = new FileReader();
      reader.addEventListener('load', (e) => {
        this.bus.$emit('readPhotoFile', fieldId, reader.result);
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    },
    fillField (collection, _id, fieldId) {
      window.setTimeout(() => {
        // console.log('DDDDDDDDDDDDDDD', _id);
        // console.log('DDDDDDDDDDDDDDD field', fieldId);
        this._fillField(collection, _id, fieldId);
      }, 700);
    },
    _fillField (collection, _id, fieldId) {
      // console.log('DDDDDDDDDDDDDDD', _id);
      // console.log('DDDDDDDDDDDDDDD field', fieldId);
      if (!_id)
      {
        try {
          document.getElementById(fieldId).innerHTML = 'none';
        } catch (error) {
          console.warn('element does not exist ' + fieldId);
        }
        return;
      }
      if (!document.getElementById(fieldId))
      {
        return;
      }
      (async (elId) => {
        // if (!document.getElementById(elId)) return;
        try {
          let { error, data } = await getOnLocalCollection(collection.collection, _id);
          let keys = collection.labelKey.split(',');
          let text = '';
          keys.forEach(k => {
            text += ' ' + data[k.toString().trim()].toString().trim();
          });
          document.getElementById(elId).innerHTML = text;
        } catch (error) {
          // console.log(error);
          console.warn('error on filling field', fieldId);
          console.warn('searching for:', collection.collection);
          console.warn('value:', _id);
          console.warn('target div id:', elId);
        }
      })(fieldId);
    },
    toggleAll () {
      this.bus.$emit('toggleAll');
    },
    toggleOne (item) {
      this.bus.$emit('toggleOne', item);
    },
    changeSort (column) {
      this.bus.$emit('changeSort', column);
    },
    getGridWidth (property) {
      return getGridWidth(property);
    },
    getFormType (property) {
      return getFormType(property);
    },
    getGridColAlign (property) {
      return getGridColAlign(property);
    },
  }
};

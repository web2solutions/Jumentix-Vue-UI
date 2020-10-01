/* global session store $route */
import { setFormFields, bus, getGridWidth } from '../../helpers/helpers';
import session from '../../helpers/session';
import xFormGrid from './xFormGrid.vue';
export default {
  name: 'xGrid',
  props: ['forms', 'dialog', 'entity', 'selected', 'totalDocuments', 'headers', 'original_documents', 'documents', 'loading', 'itemKey'],
  components: {
    xFormGrid,
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
        // // console.log('triggered pagination in grid.vm');
        bus.$emit('setPagination', this.pagination);
      },
      deep: true
    }
  },
  created () {
    // this.getAll ();
  },
  mounted () {
    bus.$emit('feedGrid');
  },
  methods: {
    mountDataForGrid (data) {
      let hide = this.headers.filter(column => { return column.hide === true });
      let records = data.items.map(doc => {
        for (let x = 0; x < hide.length; x++)
        {
          let column = hide[x];
          delete doc[column.id];
        }
        return doc;
      });
      return records;
    },
    editItem (item) {
      bus.$emit('editCRUDItem', item);
    },
    previewItem (item) {
      bus.$emit('previewCRUDItem', item);
    },
    deleteItem (item) {
      bus.$emit('deleteItem', item);
    },
    close () {
      bus.$emit('close');
    },
    log (e) {
      console.log(e);
    },
    toggleAll () {
      bus.$emit('toggleAll');
    },
    toggleOne (item) {
      bus.$emit('toggleOne', item);
    },
    changeSort (column) {
      bus.$emit('changeSort', column);
    },
    bus () {
      return bus;
    },
    getGridWidth (property) {
      return getGridWidth(property);
    },
  }
};

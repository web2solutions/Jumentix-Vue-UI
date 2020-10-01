/* global session */
import Vue from 'vue';
import { getFromApi } from '../../helpers/helpers';
export default {
  name: 'MenuNav',
  components: {},
  props: {
    bus: {
      type: Object,
      default: function () { return {} },
    }
  },
  data: () => ({
    fab: false,
    isEditing: false,
    searchParams: '',
    isLoading: false,
    model: null,
    searchType: 'Name',
    search: null,
    item_text: 'name',
    item_value: '_id',
    entity: 'Human',
    currentPath: null,
    itemsMenu: [
      { title: 'Name' },
      { title: 'Case Number' },
      { title: 'Invoice Number' }
    ],
    items: [],
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    }
  }),
  computed: {},
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
    async search (val) {
      // console.log('Search start: ', this.searchType, this.model, val);
      if (this.model) {
        if (this.searchType === 'Name') {
          // this.goTo('/summary/' + this.model.id, val);
          this.bus.$emit('doTextSearch', false, this.model);
        } else if (this.searchType === 'Invoice Number') {
          this.goTo('/invoice/' + this.model.id);

        } else if (this.searchType === 'Case Number') {
          this.goTo('/summary/' + this.model.id);

        } else if (this.searchType === 'Family Name') {
          // this.goTo('/summary/' + this.model.id);
          this.bus.$emit('doTextSearch', false, this.model);
        } else {
          this.goTo('/summary/' + this.model.id);
        }
      }

      if (val === undefined || val === null) {
        console.log('val clear: ', val);
        // this.items = [];
        // return;
      }
      // Items have already been loaded
      if (this.items.length > 0) return;

      this.isLoading = true;
      let where = false;
      // let where = { 'first_name': { $regex: val }};
      // let where = { 'or': [{ 'status': 'Closed' }, { 'key2': 'value2' }] };
      let { data, total, error } = await getFromApi(this.entity, this, where);
      if (error) {
        console.log(error);
      } else {
        this.items = data;
        this.isLoading = false;
        console.log('GetItems: ', this.items);
        // return;
      }
    }
  },
  created () {
    // this.bus = new Vue();
    this.currentPath = this.$router.currentRoute.fullPath;
    switch (this.currentPath) {
      case '/invoices':
        this.itemsMenu = [
          { title: 'Family Name' },
          { title: 'Case Number' },
        ];
        this.searchType = 'Family Name';
        break;

      default:
        
        break;
    }
    
    // console.log('created: ', this.currentPath);
  },
  mounted () {
    //
  },
  methods: {
    selectFilter (item, i) {
      this.items = [];
      this.model = null;

      switch (item.title) {
        case 'Name':
          this.searchType = item.title;
          this.item_text = 'name';
          this.item_value = '_id';
          this.entity = 'Human';
          break;

        case 'Family Name':
          this.searchType = item.title;
          this.item_text = 'name';
          this.item_value = '_id';
          this.entity = 'Human';
          break;

        case 'Case Number':
          this.searchType = item.title;
          this.item_text = 'name';
          this.item_value = '_id';
          this.entity = 'Human';
          break;

        case 'Invoice Number':
          this.searchType = item.title;
          this.item_text = 'invoice_number';
          this.item_value = 'id';
          this.entity = 'Invoice';
          break;
        
        default:
          this.searchType = 'Name';
          break;
      }
      // console.log(this.searchType, this.items, this.items.length);
    },
    goTo (path, id) {
      console.log('GOTO >>>>>>>>>>>>>>>>>>', path, id);
      this.$router.push({ 
        path: path,
        query: id
        // params: { id }
      });
    }
  }
};

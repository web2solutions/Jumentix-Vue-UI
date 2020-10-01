
/* global session store $route moment */

import { setGriHeaders, setFormFields } from '../../../helpers/helpers';
import session from '../../../helpers/session';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import MenuNav from '../MenuNav';
export default {
  components: {
    'component-menu-nav': MenuNav,
    VuePerfectScrollbar
  },
  name: 'InvoicesCustomer.',
  data: () => ({
    entity: 'Invoice',
    search: '',
    headers: [],
    expand: false,
    invoiceItems: [],
    selected: [],
    documents: [],
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    customerID: '',
    customerName: ''
  }),
  computed: {
    swagger () {
      return this.store.state.swagger;
    }
  },
  watch: {
    pagination: {
      handler () {
        console.log('watch pagination ', this.pagination);
        this.invoiceItems = [];
        this.getDataFromApi().then(data => {
          this.documents = [];
          data.items.forEach(doc => this.documents.push(doc));
          this.documents = data.items;
          this.totalDocuments = data.total;
          this.pagination.totalItems = data.total;
        });
      },
      deep: true
    },
    dialog (val) {
      val || this.close();
    }
  },
  created () {
    // this.initialize();
    this.customerID = this.$router.currentRoute.params.id;
  },
  mounted () {
    for (let prop in this.swagger.definitions[this.entity].properties) {
      if (
        this.swagger.definitions[this.entity].properties.hasOwnProperty(prop)
      ) {

        let settings = {
          text: this.swagger.definitions[this.entity].properties[prop]['x-label'] || this.swagger.definitions[this.entity].properties[prop]
            .description,
          align: 'left',
          sortable: true,
          value: prop,
          id: prop
        };

        if (!this.swagger.definitions[this.entity].properties[prop]['x-grid-hide'] && prop !== '_id') {
          this.headers.push(settings);
        }
      }
    }
    this.headers.push({ text: 'Amount', align: 'center', value: 'amount', id: 'amount', sortable: true });
    // console.log('this.headers', this.headers);

    this.getDataFromApi().then(data => {
      this.documents = [];
      data.items.forEach(doc => this.documents.push(doc));
      // this.documents = data.items;
      this.totalDocuments = data.total;
      this.pagination.totalItems = data.total;
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
    session.swagger({
      success: response => {
        // console.log('beforeRouteEnter: ', response);
        store.commit('setSwagger', response);
        next();
      },
      error: (xhr, ajaxOptions, thrownError) => {
        console.log(thrownError);
        next();
      }
    });
  },
  methods: {
    getDataFromApi () {
      this.loading = true;
      return new Promise(async (resolve, reject) => {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        // console.log('sortBy, descending: ', sortBy, descending);

        const order = descending ? -1 : 1;
        const offset = page * rowsPerPage - rowsPerPage;
        let response = await session.http({
          url: `${this.entity}?where={"drawee_human":"${this.customerID}"}&llimit=${rowsPerPage}&offset=${offset}&sort={"${sortBy}":${order}}`
        });

        let items = response.data;
        const total = response.count;
        console.log('session: ', session.user().human.id);
        this.Items = items.map(doc => {
          let newDoc = {};

          if (doc['drawee_human'] === this.customerID) {
            
            for (let prop in doc) {
              if (doc.hasOwnProperty(prop)) {
                console.log('DOC', doc['drawee_human'], this.customerID);
                newDoc[prop] = doc[prop];
                if (prop === 'item' && doc[prop].length >= 1) {
                    
                  try {
                    let amount = 0;
                    newDoc['amount'] = amount;
                    
                    doc[prop].forEach(element => {
                      
                      this.getOne('Good', element).then(data => {
                        
                        amount = (amount + data.amount);
                        newDoc['amount'] = amount;
  
                        // console.log('ITEM doc[prop]', amount, data.amount);
                      });
  
                    });
                    
                  } catch (e) {
                    console.log('ERROR UPDATE', e);
                  }
                }
  
                if (prop === 'drawee_human' && doc[prop] != null) {  
                  try {
                    newDoc['customer_name'] = '';
                    this.getOne('Human', doc[prop]).then(data => {
                      this.customerName = data.name;
                      newDoc['customer_name'] = data.name;
                    });
                    
                  } catch (e) {
                    console.log('ERROR UPDATE', e);
                  }
                } 
              }
            }
            newDoc['createdAt'] = doc['createdAt'];
          }
          
          return newDoc;
          
        });
        this.Items.forEach(element => { 
          if (typeof element.id !== 'undefined') {
            this.invoiceItems.push(element);
            console.log(element);
          }
        });
        console.log('invoiceItems: ', this.invoiceItems);
        this.loading = false;
        resolve({
          items,
          total
        });
      });
    },
    async getOne (entity, id) {
      try {
        let response = await session.http({ url: `${entity}/${id}` });
        // console.log(response.data);
        return response.data;
      } catch (e) {
        console.log(e);
        return Error(e);
      }
    },
    toggleAll () {
      console.log('select', this.selected, this.documents.slice());
      if (this.selected.length) {
        this.selected = [];
      } else {
        this.selected = this.documents.slice();
      }
    },
    changeSort (column) {
      console.log('sort', column);
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    }
  }
};
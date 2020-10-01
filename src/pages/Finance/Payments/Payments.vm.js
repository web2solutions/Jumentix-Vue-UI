/* global session store $route moment */
import Vue from 'vue';
import { getOnLocalCollection, mountDataForGrid, getFromApi, remove, getOne } from '../../../helpers/helpers';
import session from '../../../helpers/session';
import swal from 'sweetalert2';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import MenuNav from '../MenuNav';
export default {
  components: {
    'component-menu-nav': MenuNav,
    VuePerfectScrollbar
  },
  name: 'Payments',
  data: () => ({
    entity: 'Invoice',
    search: '',
    headers: [],
    invoiceItems: [],
    selected: [],
    documents: [],
    loading: false,
    statusColor: '',
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    }
  }),
  computed: {
    swagger () {
      return this.store.state.swagger;
    }
  },
  watch: {
    pagination: {
      handler () {
        // console.log('watch pagination ', this.pagination);
        this.feedGrid(this.entity);
      },
      deep: true
    },
    dialog (val) {
      val || this.close();
    }
  },
  created () {
    this.bus = new Vue();
    // this.initialize();
  },
  mounted () {
    if (!this.bus) this.bus = new Vue();

    this.bus.$on('doTextSearch', (search, object) => {
      this.feedGrid(this.entity, search, object);
      console.log('search >>>>>>>>', search, object);
    });

    this.feedGrid(this.entity);

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
    async feedGrid (url, search, object) {
      this.loading = true;
      this.invoiceItems = [];
      let where = {};
      if (object) {
        let wallets = [];
        let wallet = await this.getWallet(object.id);
        if (wallet) {
          wallet.forEach(element => {
            wallets.push({ drawee: element.id });
          });
          console.log('Wallet result_+_+_+_+_+_+_+_+_+_+_+_+_+_+_', wallet, wallets);
          where = { 'status': 'Paid', $or: wallets };
        }
        else
        {
          return;
        }
      }
      else
      {
        where = { 'status': 'Paid' };
      }
      // let where = search ? { 'first_name': { '$regex': search, '$options': 'i' }} : { 'status': 'Paid' };
      // let where = { 'status': 'Paid' };
      
      let { data, total, error } = await getFromApi(url, this, where);

      if (error) {
        console.log('Error', url, error);
      } else {
        console.log('Invoice', where, data);
        this.invoiceItems = [];
        if (data.length > 0) {
          this.invoiceItems = data.map(doc => {
            let newDoc = {};
          
            for (let prop in this.swagger.definitions[this.entity].properties) {
              if (this.swagger.definitions[this.entity].properties.hasOwnProperty(prop)) {
  
                switch (prop) {
  
                  case 'drawee':
  
                    if (doc[prop] != null) {
                      newDoc['customer_id'] = ''; // reset
                      console.log('doc[prop]', doc[prop], doc[prop]);
                      (async () => {
                        let { error, data, status } = await getOnLocalCollection('Wallet', doc[prop]);
                        if (error) {
                          console.log('ERROR GET drawee: ', error);
                        }
                        else 
                        {
                          console.log(doc[prop], data);
                          newDoc['customer_id'] = data.human;
                          newDoc[prop] = doc[prop];
                        }
                      })();
                    }
                    break;
  
                  case 'transaction':
                    if (doc[prop].length >= 1) {
                      newDoc['transaction_name'] = ''; // reset
                      newDoc['transaction_type'] = '';
  
                      doc[prop].forEach(async element => {
                        let { error, data, status } = await getOnLocalCollection('Transaction', element);
                        if (error) {
                          console.log('ERROR GET Transaction: ', error);
                        }
                        else 
                        {
                          console.log('Transation', data);
                          newDoc['transaction_name'] = data.name;
                          newDoc['transaction_type'] = data.transaction_type;
                          newDoc['amount'] = data.amount.toLocaleString(session.user().language, { style: 'currency', currency: session.user().currency_code });
                          newDoc[prop] = doc[prop];
                        }
                      });
                    }
                    break;
                  
                  default:
                    newDoc[prop] = doc[prop];
                }
              
              }
            }
            newDoc['createdAt'] = doc['createdAt'];
            return newDoc;
          });

          console.log('LOADING: ', this.invoiceItems);
        }
        this.loading = false;
      }

      
    },

    async getWallet (id) {
      let where = { 'human': id };
      let { data, total, error } = await getFromApi('Wallet', this, where);

      if (error) {
        console.log('Error on get Wallet', error);
      } else {
        console.log('Wallets', data);
        if (data.length > 0) {
          return data;
        }        
      }
    },
    toggleAll () {
      // console.log('select', this.selected, this.documents.slice());
      if (this.selected.length) {
        this.selected = [];
      } else {
        this.selected = this.documents.slice();
      }
    },
    changeSort (column) {
      // console.log('sort', column);
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    deleteItem (item) {
      console.log(item._id);
      swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          (async () => {
            let { error, data, status } = await remove('Invoice', item._id);
            if (error) {
              console.log('ERROR GET Invoice: ', error);
            }
            else 
            {
              console.log('DELETE: ', data);
              const index = this.invoiceItems.indexOf(item);
              this.invoiceItems.splice(index, 1);
              swal.fire(
                'Deleted!',
                'Your invoice #' + data.invoice_number + ' has been deleted.',
                'success'
              );
            }
          })();
        }
      });
      /*  const index = this.invoiceItems.indexOf(item);
      confirm('Are you sure you want to delete this item?') &&
        this.invoiceItems.splice(index, 1); */
    },
    goTo (path, id) {
      // console.log(path, id);
      this.$router.push({ 
        path: path,
        // params: { id }
      });
    },
    fillField (collection, id, elementId) {
      window.setTimeout(() => {

        this._fillField(collection, id, elementId);
      }, 1300);
    },

    async _fillField (collection, id, elementId) {
      let { data, total, error } = await getOnLocalCollection(collection, id);
      if (error)
      {
        console.error('error get ' + collection, error);
        return { data, error };
      } 
      else
      {
        if (data) {
          if (document.getElementById(elementId)) {
            document.getElementById(elementId).innerHTML = data.name;
          }
        }
        else
        {
          if (document.getElementById(elementId)) {
            document.getElementById(elementId).innerHTML = 'none';
          }
        }
        
      }
    }
  }
};
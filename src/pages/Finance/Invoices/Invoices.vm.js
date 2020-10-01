
/* global session store $route moment */
import Vue from 'vue';
import { getOne, mountDataForGrid, getFromApi, remove, getOnLocalCollection } from '../../../helpers/helpers';
import session from '../../../helpers/session';
import swal from 'sweetalert2';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import MenuNav from '../MenuNav';
export default {
  components: {
    'component-menu-nav': MenuNav,
    VuePerfectScrollbar
  },
  name: 'Invoices',
  data: () => ({
    entity: 'Invoice',
    search: '',
    headers: [],
    invoiceItems: [],
    invoiceItems2: [],
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
      let populate = ''; // 'target_delivery';
      let where = {};
      if (object) {
        let wallets = [];
        let wallet = await this.getWallet(object.id);
        if (wallet) {
          wallet.forEach(element => {
            wallets.push({ drawee: element.id });
          });
          console.log('Wallet result_+_+_+_+_+_+_+_+_+_+_+_+_+_+_', wallet, wallets);
          where = { $or: wallets };
        }
        else
        {
          return;
        }
      }

      
      let { error, data, status } = await getFromApi(this.entity, this, where, populate);

      if (error) {
        console.log('ERROR GET Invoice: ', error);
        this.showSnack('ERROR GET Invoice: ', error);
      }
      else 
      {
        // console.log('Invoices ----->>>>>', data);
        this.invoiceItems = [];
        if (data.length > 0) {
          this.invoiceItems = await data.map(doc => {
            let newDoc = {};
            for (let prop in this.swagger.definitions[this.entity].properties) {
              if (this.swagger.definitions[this.entity].properties.hasOwnProperty(prop)) {
                // console.log('prop', prop);
                switch (prop) {
                  case 'good':
                    if (doc[prop].length > 0) {
                      newDoc['amount'] = ''; // Reset
                      let amount = 0;
                      doc[prop].forEach(async element => {

                        let { error, data, status } = await getOnLocalCollection('Good', element.good);
                        if (error) {
                          console.log('ERROR GET Good: ', error);
                        }
                        else 
                        {
                          amount = amount + (data.quantity + data.unity_price);
                          newDoc['amount'] = amount.toLocaleString(session.user().language, { style: 'currency', currency: session.user().currency_code });
                          console.log('amount', doc[prop], data);
                        }
                      });

                    }
                    break;
    
                  case 'drawee':
                    if (doc[prop] && doc[prop].length > 0) {
                      newDoc['customer_name'] = ''; // reset
                      (async () => {
                        let wallet = await getOnLocalCollection('Wallet', doc[prop]);
                        if (wallet.error) {
                          console.log('walletData.ERROR GET drawee_human: ', wallet.error);
                        }
                        else 
                        {
                          let walletData = wallet.data;
                          let { error, data, status } = await getOnLocalCollection('Human', walletData.human);
                          if (error) {
                            console.log('ERROR GET drawee_human: ', error);
                          }
                          else 
                          {
                            // console.log('DRAWEE', doc[prop], data);
                            newDoc['customer_name'] = data.first_name + ' ' + data.last_name;
                            newDoc['customer_id'] = data.id;
                            newDoc[prop] = doc[prop];
                          }
                        }
                      })();
                    }
                    break;
    
                  case 'status':
                    if (doc[prop] === 'Open') {
                      let formated = moment(new Date(doc['due_date']).toISOString().substr(0, 10)).format('LL');
                      let end = moment(new Date(doc['due_date']).toISOString().substr(0, 10));
                      // let now = moment(new Date().toISOString().substr(0, 10));
                      let now = moment.tz((new Date().toISOString(), moment.tz.guess()));
                      let diff = end.diff(now, 'days'); //
    
                      if (diff <= -1) {
                        newDoc['statusColor'] = 'red--text';
                        newDoc[prop] = 'Overdue by ' + end.from(now);
                      }
                      else if (diff === 0) {
                        newDoc['statusColor'] = 'orange--text';
                        newDoc[prop] = 'DUE TODAY';
                      }
                      else if (diff > 0 && diff < 5) {
    
                        newDoc[prop] = 'Due in ' + diff + ' days';
    
                      }
                      else
                      {
                        newDoc[prop] = doc[prop];
                      }
                    }
                    else {
                      newDoc[prop] = doc[prop] === 'Closed' ? 'Paid' : doc[prop];
                      newDoc['statusColor'] = 'green--text';
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
        }
        
      }

      // console.log('LOADING: ', this.invoiceItems);
      this.loading = false;
      this.$forceUpdate();
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
            let { error, data, status } = await remove('Invoice', item._id, 'hard');
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
    }
  }
};
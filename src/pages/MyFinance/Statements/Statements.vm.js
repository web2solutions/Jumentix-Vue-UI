
/* global session store $route moment */
import { getOne, mountDataForGrid, getFromApi, remove } from '../../../helpers/helpers';
import session from '../../../helpers/session';
import swal from 'sweetalert2';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import MenuNav from '../MenuNav';
export default {
  components: {
    'component-menu-nav': MenuNav,
    VuePerfectScrollbar
  },
  name: 'Statements',
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
    // this.initialize();
  },
  mounted () {
  
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
    feedGrid (url) {
      this.loading = true;
      (async () => {
        let { data, total, error } = await getFromApi(url, this);
        this.original_documents = data;
        this.documents = mountDataForGrid(this.headers, data);
        this.totalDocuments = total;
        this.pagination.totalItems = total;

        this.invoiceItems = data.map(doc => {
          let newDoc = {};
          for (let prop in this.swagger.definitions[this.entity].properties) {
            if (this.swagger.definitions[this.entity].properties.hasOwnProperty(prop)) {

              switch (prop) {
                case 'item':
                  if (doc[prop].length >= 1) {
                    let amount = 0;
                    doc[prop].forEach(element => {
                      // eslint-disable-next-line max-nested-callbacks
                      (async () => {
                        let { error, data, status } = await getOne('Good', element);
                        if (error) {
                          console.log('ERROR GET Good: ', error);
                        }
                        else 
                        {
                          amount = (amount + data.amount);
                          newDoc['amount'] = amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                        }
                      })();
                    });
                  }
                  break;

                case 'drawee_human':

                  if (doc[prop] != null) {
                    newDoc['customer_name'] = ''; // reset
                    
                    (async () => {
                      let { error, data, status } = await getOne('Human', doc[prop]);
                      if (error) {
                        console.log('ERROR GET drawee_human: ', error);
                      }
                      else 
                      {
                        newDoc['customer_name'] = data.name;
                        newDoc[prop] = doc[prop];
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
                    let diff = end.diff(now, 'days'); // 1
                    // console.log('DATE', doc['due_date'], end, now, diff);
                    // console.log('NOW', now, new Date().toISOString().substr(0, 10));

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
                    // newDoc[prop] = formated;
                    // console.log('DATE', diff, end, doc[prop]);
                    // console.log('FORMAT', formated);
                    // newDoc[prop] = moment(doc[prop]).format('DD-MM-YYYY');
                    // console.log('due-date', doc[prop]);
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
        // console.log('LOADING: ', this.invoiceItems);
        this.loading = false;
      })();
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
    }
  }
};
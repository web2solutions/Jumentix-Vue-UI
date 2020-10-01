import { getFromApi, getOne } from '../../helpers/helpers';
import session from '../../helpers/session';
import MenuNav from './MenuNav';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';

export default {
  name: 'Summary',
  components: {
    'component-menu-nav': MenuNav,
    VuePerfectScrollbar
  },
  data: () => ({
    customerID: '',
    customer: '',
    invoiceAmount: 0,
    lastInvoiceAmount: 0,
    lastInvoiceID: null,
    lastInvoiceNumber: null,
    lastInvoiceDate: null,
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
  mounted () {
    this.customerID = this.$router.currentRoute.params.id;
    this.feedCustomer(this.customerID);
    console.log('mounted ', this.customerID);
  },
  created () {
    console.log('created ', this.customerID);
  },
  methods: {
    async feedCustomer (id) {
      let { error, data, status } = await getOne('Human', id);
      if (error) {
        console.log(error);
      } else {
        this.customer = data;
        // console.log(this.customer);
      }
      this.getInvoices(this.customer.id);
    },
    async getInvoices (id) {
      let where = { 'drawee_human': id };
      
      let { data, total, error } = await getFromApi('Invoice', this, where);
      if (error) {
        console.log(error);
      } 
      else
      {
        this.Invoices = data;
        if (this.Invoices.length > 0) {
          // get last invoice paid
          let { data, total, error } = await this.getLast('Transaction');
          if (error) {
            console.log(error);
          } else {
            
            if (data) {
              console.log('getlast: ', data);
              this.lastInvoiceAmount = data[0].amount;
              this.lastInvoiceID = data[0].invoice[0];
              this.lastInvoiceDate = new Date(data[0].createdAt).toDateString();
            }
            // console.log('this.lastInvoiceAmount: ', this.lastInvoiceAmount, this.lastInvoiceID);
          }

          let amount = 0;
          this.Invoices.forEach(invoice => {
            // console.log('item ', invoice.status);
            if (invoice.id === this.lastInvoiceID) {
              console.log('last invoice', this.lastInvoiceID);
              this.lastInvoiceNumber = invoice.invoice_number;
              
            }

            if (invoice.status === 'Open' && invoice.item.length > 0) {
              invoice.item.forEach(element => {
                (async () => {
                  let { error, data, status } = await getOne('Good', element);
                  if (error) {
                    console.log('ERROR GET Good: ', error);
                  }
                  else 
                  {
                    amount += data.amount;
                    this.invoiceAmount = amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                    console.log('this.customer.amount ', this.invoiceAmount, amount);
                  }
                })();
              });
            }
          });
        } 
        else
        {
          //
        }
        // return;
      }
    },
    async getLast (entity) {
      try {
        let response = await session.http({ url: `${entity}?limit=1&sort={"$natural":-1}&where={"drawee":"${this.customerID}"}` });
        console.log(response.data);
        let data = response.data;
        this.loading = false;
        return {
          data,
          total: response.count,
          error: response.error || null
        };
      } catch (e) {
        console.log(e);
        return Error(e);
      }
    }
  }

};
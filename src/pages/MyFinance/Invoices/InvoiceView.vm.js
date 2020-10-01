/* global session */
import session from '../../../helpers/session';
import { getOnLocalCollection } from '../../../helpers/helpers';
import MenuNav from '../MenuNav';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  name: 'InvoiceView',
  components: {
    'component-menu-nav': MenuNav,
    VuePerfectScrollbar
  },
  data: () => ({
    invoice: {},
    invoiceItems: [],
    billTo: '',
    termsConditions: '',
    headers: [
      { text: 'Name', align: 'left', sortable: false, value: 'name' },
      { text: 'Type', align: 'center', value: 'type', sortable: false },
      { text: 'Unity', align: 'center', value: 'unity', sortable: false },
      { text: 'Unity Price', align: 'center', value: 'unity_price', sortable: false },
      { text: 'Quantity', align: 'center', value: 'quantity', sortable: false },
      { text: 'Total', align: 'center', value: 'amount', sortable: false }
    ],
    items: [],
  }), 
  mounted () {
    //
  },
  created () {
    let invoiceID = this.$router.currentRoute.params.id;
    this.getInvoice(invoiceID);
  },
  computed: {
    session () {
      return this.store.state.session;
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (!session.isOnline())
    {
      // return;
      next({ path: '/login' });
    }
    else
    {
      next();
    }
    // console.log('from', from, to);
    let paramID = to.params.id;
    this.getInvoice(paramID);
    next();
  },
  methods: {
    async getInvoice (invoiceID) {
      let { error, data, status } = await getOnLocalCollection('Invoice', invoiceID);
      if (error) {
        console.log('ERROR GET Invoice: ', error);
      }
      else 
      {
        this.invoice = data;
        console.log('INVOICE: ', this.invoice);
        this.invoiceItems = this.invoice['good'];
        if (this.invoice['drawee'] != null) this.getItem('Wallet', this.invoice['drawee']);
        if (this.invoice['terms_conditions'] != null) this.getItem('InvoiceTerm', this.invoice['terms_conditions']);
        
      }
    },
    async getItem (entity, id) {
      let { error, data, status } = await getOnLocalCollection(entity, id);
      if (error) {
        console.log('ERROR GET' + entity, error);
      }
      else 
      {
        console.log(entity, data);
        switch (entity) {
          case 'Wallet':
            this.billTo = data.name;
            break;
          case 'InvoiceTerm':
            this.termsConditions = data.label;
            break;
          default:
            break;
        }
      }

    },
    fillField (collection, id, elementId) {
      window.setTimeout(() => {

        this._fillField(collection, id, elementId);
      }, 700);
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
        if (data.name) {
          document.getElementById(elementId).innerHTML = data.name;
        }
        else
        {
          document.getElementById(elementId).innerHTML = 'none';
        }
        
      }
    }

  }
};
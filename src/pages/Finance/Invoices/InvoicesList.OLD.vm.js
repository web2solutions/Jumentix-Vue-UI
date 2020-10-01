import { request } from 'https';

/* global */

// import kendo from '@progress/kendo-ui'
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  name: 'InvoicesList',
  data: () => ({
    search: null,
    searched: [],
    invoices: [],
    allInvoices: [{
      'InvoiceID': 1,
      'InvoiceNumber': 'INV-1951',
      'InvoiceReference': '',
      'InvoiceDate': '06 Aug 2018',
      'InvoiceTotal': '$0.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 2,
      'InvoiceNumber': 'INV-1954',
      'InvoiceReference': '',
      'InvoiceDate': '10 Aug 2018',
      'InvoiceTotal': '$1.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 3,
      'InvoiceNumber': 'INV-1956',
      'InvoiceReference': '',
      'InvoiceDate': '17 Aug 2018',
      'InvoiceTotal': '$0.10',
      'InvoiceStatus': 'Due in 5 days'
    },
    {
      'InvoiceID': 4,
      'InvoiceNumber': 'INV-1961',
      'InvoiceReference': '',
      'InvoiceDate': '06 Aug 2018',
      'InvoiceTotal': '$0.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 5,
      'InvoiceNumber': 'INV-1964',
      'InvoiceReference': '',
      'InvoiceDate': '10 Aug 2018',
      'InvoiceTotal': '$1.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 6,
      'InvoiceNumber': 'INV-1966',
      'InvoiceReference': '',
      'InvoiceDate': '17 Aug 2018',
      'InvoiceTotal': '$0.10',
      'InvoiceStatus': 'Due in 5 days'
    },
    {
      'InvoiceID': 7,
      'InvoiceNumber': 'INV-1971',
      'InvoiceReference': '',
      'InvoiceDate': '06 Aug 2018',
      'InvoiceTotal': '$0.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 8,
      'InvoiceNumber': 'INV-1974',
      'InvoiceReference': '',
      'InvoiceDate': '10 Aug 2018',
      'InvoiceTotal': '$1.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 9,
      'InvoiceNumber': 'INV-1976',
      'InvoiceReference': '',
      'InvoiceDate': '17 Aug 2018',
      'InvoiceTotal': '$0.10',
      'InvoiceStatus': 'Due in 5 days'
    },
    {
      'InvoiceID': 10,
      'InvoiceNumber': 'INV-1981',
      'InvoiceReference': '',
      'InvoiceDate': '06 Aug 2018',
      'InvoiceTotal': '$0.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 12,
      'InvoiceNumber': 'INV-1984',
      'InvoiceReference': '',
      'InvoiceDate': '10 Aug 2018',
      'InvoiceTotal': '$1.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 13,
      'InvoiceNumber': 'INV-1996',
      'InvoiceReference': '',
      'InvoiceDate': '17 Aug 2018',
      'InvoiceTotal': '$0.10',
      'InvoiceStatus': 'Due in 5 days'
    }],
    invoicesPaid: [{
      'InvoiceID': 1,
      'InvoiceNumber': 'INV-1951',
      'InvoiceReference': '',
      'InvoiceDate': '06 Aug 2018',
      'InvoiceTotal': '$0.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 2,
      'InvoiceNumber': 'INV-1954',
      'InvoiceReference': '',
      'InvoiceDate': '10 Aug 2018',
      'InvoiceTotal': '$1.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 4,
      'InvoiceNumber': 'INV-1961',
      'InvoiceReference': '',
      'InvoiceDate': '06 Aug 2018',
      'InvoiceTotal': '$0.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 5,
      'InvoiceNumber': 'INV-1964',
      'InvoiceReference': '',
      'InvoiceDate': '10 Aug 2018',
      'InvoiceTotal': '$1.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 7,
      'InvoiceNumber': 'INV-1971',
      'InvoiceReference': '',
      'InvoiceDate': '06 Aug 2018',
      'InvoiceTotal': '$0.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 8,
      'InvoiceNumber': 'INV-1974',
      'InvoiceReference': '',
      'InvoiceDate': '10 Aug 2018',
      'InvoiceTotal': '$1.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 10,
      'InvoiceNumber': 'INV-1981',
      'InvoiceReference': '',
      'InvoiceDate': '06 Aug 2018',
      'InvoiceTotal': '$0.00',
      'InvoiceStatus': 'Paid'
    },
    {
      'InvoiceID': 12,
      'InvoiceNumber': 'INV-1984',
      'InvoiceReference': '',
      'InvoiceDate': '10 Aug 2018',
      'InvoiceTotal': '$1.00',
      'InvoiceStatus': 'Paid'
    }]
  }),
  methods: {
    newInvoice () {
      window.alert('Noop');
    },
    searchOnTable () {
      this.searched = this.searchByName(this.invoices, this.search);
    },
    toLower (text) {
      return text.toString().toLowerCase();
    },
    searchByName (items, term) {
      if (term) {
        return items.filter(item => this.toLower(item.InvoiceNumber).includes(this.toLower(term)));
      }
      return items;
    },
    onSelect (item) {
      this.selected = item;
      console.log(item);
      // this.$router.push('/invoices/' + item.InvoiceNumber)
      this.router.push({
        path: `/invoices/${item.InvoiceNumber}`
      });
    }
  },
  created () {
    // let invoices = require('../../../api/invoices');

    // this.invoices = invoices.data;
    console.log(this.$router);
    this.invoices = this.$router.currentRoute.name === 'Payments' ? this.invoicesPaid : this.allInvoices;
    this.searched = this.invoices;
  },
  components: {
    VuePerfectScrollbar
  },
  beforeRouteUpdate (to, from, next) {
    // console.log('from', from, to);
    let paramID = to.params.id;
    this.getInvoice(paramID);
    next();
  }
};
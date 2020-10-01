/* global session store $route */
import Vue from 'vue';
import { update, create, getFromApi, getLocalCollection, getOnLocalCollection, getOne } from '../../../helpers/helpers';
import session from '../../../helpers/session';
import Material from 'vuetify/es5/util/colors';
import swal from 'sweetalert2';
import MenuNav from '../MenuNav';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import xSimpleForm from '@/components/xCRUD/xSimpleForm.vue';
import Sortable from 'sortablejs';
export default {
  name: 'InvoiceCreate',
  components: {
    'component-menu-nav': MenuNav,
    VuePerfectScrollbar,
    xSimpleForm
  },
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    formData: {},
    today: null,
    date_issue: null,
    due_date: null,
    invoice_number: '',
    order_number: '',
    drawee: null,
    transaction: [],
    case: [],
    status: 'Open',
    term: '',
    customer_notes: '',
    item: [],
    itemSelected: {},
    itemDisabled: false,
    terms_conditions: '',
    payment_options: [],
    loading: false,
    search: null,
    searchItems: null,
    searchLabel: 'Select a Client',
    searchText: 'Name',
    searchClient: true,
    date_issue_pick: false,
    due_date_pick: false,
    color: Material,
    dialog: false,
    dialogAddClient: false,
    select: null,
    nameLimit: 60,
    entriesWallet: [],
    entriesItem: [],
    isLoading: false,
    headers: [
      { sortable: false },
      { text: 'Name', align: 'left', sortable: false, value: 'name' },
      { text: 'Type', align: 'center', value: 'type', sortable: false },
      { text: 'Unity', align: 'center', value: 'unity', sortable: false },
      { text: 'Unity Price', align: 'center', value: 'unity_price', sortable: false },
      { text: 'Quantity', align: 'center', value: 'quantity', sortable: false },
      { text: 'Total', align: 'center', value: 'amount', sortable: false },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    items: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      type: '',
      unity_price: '',
      unity: '',
      quantity: 0,
      amount: ''
    },
    defaultItem: {
      name: '',
      type: '',
      unity_price: '',
      unity: '',
      quantity: 0,
      amount: ''
    },
    newDoc: {},
    forms: {
      crud: {
        name: 'crud',
        fields: [],
        values: { },
        labels: { },
        user_values: { },
        headers: { },
        defaultItem: { },
        newItem: { },
        dialog: false,
        editedIndex: -1,
        valid: false,                                            
      }
    },
    bus: false,
    isFormSimple: false,
    snack: false,
    snackColor: '',
    snackText: '',
  }),
  mounted () {
    // Get Last Invoice and Order Number
    if (!this.bus) this.bus = new Vue();
    this.getLast();
    this.feedSelects('Wallet');
    this.feedSelects('Good');
    /* this.$on('save', async (event) => {

      this.bus.$emit('addToPayload', { 'foo': 'bar' });

      // console.log('save  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', this);
      let resp = await this.bus.$emit('save', true);
      // console.log(resp);

      console.log('save  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', resp);
      // this.bus.$emit('save', true);
      // return;
    }); */

    this.bus.$on('savedOnServer', (response) => {
      if (response.data) {
        console.log('savedOnServer', response);
        swal.fire({
          type: 'success',
          title: 'Invoice #' + response.data.invoice_number + ' created successfully!',
          showConfirmButton: false,
          timer: 2500,
          onClose: () => {
            this.$router.push({ path: 'invoices' });
          }
        });
      } else {
        console.log(response.error);
      }
      
      
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
  },
  computed: {
    session () {
      return this.store.state.session;
    },
    formTitle () {
      return this.editedIndex === -1 ? 'Add Item' : 'Edit Item';
    },
    fields () {
      if (!this.drawee) return [];
      return Object.keys(this.drawee).map(key => {
        return {
          key,
          value: this.drawee[key] || 'n/a'
        };
      });
    },
    itemsAmount () {
      let countItem = 0;
      for (let prop in this.items)
      {
        if (this.items.hasOwnProperty(prop))
        {
          countItem += this.items[prop].quantity * this.items[prop].unity_price;
          // console.log(prop, this.items[prop]);
        }
      }
      // countItem = countItem > 0 ? countItem.toLocaleString(session.user().language, { style: 'currency', currency: session.user().currency_code }) : 0;
      return countItem.toLocaleString(session.user().language, { style: 'currency', currency: session.user().currency_code });
    }
  },

  watch: {
    dialog (val) {
      val || this.close();
    }
  },

  created () {
    // this.initialize();
    if (!this.bus) this.bus = new Vue();
    this.today = new Date().toISOString().substr(0, 10);
    this.date_issue = this.today;
    this.due_date = this.today;
  },
  directives: {
    SortableTable: {
      bind (el, binding, vnode) {
        let sortableElement = el.getElementsByTagName('tbody')[0];
        const options = {
          handle: '.sortHandle',
          animation: 150,
          onUpdate: function (event) {
            vnode.child.$emit('sorted', event);
          },
        };
        Sortable.create(sortableElement, options);
      },
    },
  },
  methods: {
    async feedSelects (entity) {
      let { data, total, error } = await getLocalCollection(entity);
      if (error) {
        console.log('feedSelects ERROR: ', error);
      } else {
        // console.log('feedSelects', entity, data);
        switch (entity) {
          case 'Wallet':
            // this.entriesWallet = data.map(async entry => {
            data.forEach(async entry => {
              let { data, total, error } = await getOnLocalCollection('Human', entry.human);
              let newDoc = {};
              if (error) {
                console.log('feedSelects ERROR: ', error);
              } else {
                newDoc['Name'] = data['name'];
                newDoc['Email'] = data['email'][0].email;
                newDoc['ID'] = entry['id'];
                newDoc['Wallet'] = entry['name'];
              }

              this.entriesWallet.push(newDoc);
            });
        
            break;
          case 'Good':
            if (data) {
              this.entriesItem = data;
            }
            break;
        
          default:
            break;
        }
        
      }
    },
    async getLast () {
      let { data, total, error } = await getLocalCollection('Invoice');
      if (error)
      {
        console.error('error get Invoices', error);
        return { data, error };
      } 
      else
      {
        // console.log('getlast: ', data);
        let arrOrder_number = [];
        let arrInvoice_number = [];
        for (let item in data)
        {
          if (data.hasOwnProperty(item))
          {
            arrOrder_number.push(data[item].order_number.replace('ORD', ''));
            arrInvoice_number.push(data[item].invoice_number);
            // console.log('arrOrder_number: ', arrOrder_number);
          }
        }
        this.order_number = 'ORD' + (Math.max.apply(null, arrOrder_number) + 1);
        this.invoice_number = (Math.max.apply(null, arrInvoice_number) + 1);
        // console.log('ORD', this.order_number, 'INV', this.invoice_number); // ORD ORD-224 INV INV-12204
      }
    },
    saveOrder ({
      oldIndex,
      newIndex
    }) {
      const moved = this.items.splice(oldIndex, 1)[0];
      this.items.splice(newIndex, 0, moved);
      // console.log('ItemsOrder:', this.items);
    },

    editItem (item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.itemSelected = Object.assign({}, item);
      this.itemDisabled = true;
      this.dialog = true;
    },

    deleteItem (item) {
      const index = this.items.indexOf(item);
      confirm('Are you sure you want to delete this item?') && this.items.splice(index, 1);
    },

    close () {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.itemSelected = Object.assign({}, this.defaultItem);
        this.itemDisabled = false;
        this.editedIndex = -1;
      }, 300);
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        this.items.push(this.editedItem);
      }
      console.log('Save', this.editedItem, this.items);
      this.close();
    },
    changeItem (item) {
      // this.editedItem = Object.assign({}, item);
      this.editedItem.good = item.id;
      this.editedItem.name = item.name;
      this.editedItem.type = item.type;
      this.editedItem.quantity = Number(item.quantity);
      this.editedItem.unity = item.unity;
      this.editedItem.unity_price = item.unity_price;
      this.editedItem.amount = (item.quantity * item.unity_price);
    },
    async createInvoice () {
      if (this.drawee !== null && this.drawee !== '') {
        let invoice = {
          // 'invoice_number': this.invoice_number,
          // 'order_number': this.order_number,
          'drawee': this.drawee.ID,
          // 'customer_notes': this.customer_notes,
          'due_date': this.due_date,
          'good': this.items,
          // 'payment_options': this.payment_options
        };

        this.bus.$emit('addToPayload', invoice);
        // console.log('createInvoice >>>>>>>>>>>>>>>>>>>>>>>', invoice);
        this.bus.$emit('save', true, false);
        
      } else {

        this.snack = true;
        this.snackText = 'Please select a Wallet';
        this.snackColor = 'error';

        /* swal.fire({
          type: 'error',
          title: 'All fields must be filled',
          showConfirmButton: false,
          timer: 1500,
          onClose: () => {
            // this.advancedSearch = true;
          }
        }); */
      }
    },
    async submit () {
      if (this.drawee !== null && this.drawee !== '' && this.items !== '' && this.items !== null) {
        let invoice = {
          'invoice_number': this.invoice_number,
          'order_number': this.order_number,
          'drawee': this.drawee.ID,
          'transaction': this.transaction,
          'case': this.case,
          'status': this.status,
          // 'term': this.term,
          'customer_notes': this.customer_notes,
          'due_date': this.due_date,
          'good': this.items,
          'terms_conditions': this.terms_conditions,
          'payment_options': this.payment_options
        };
        // console.log(invoice, drawee);
        let { data, error } = await create('Invoice', invoice);
        if (error)
        {
          console.error('error on update', error);
          return { data, error };
        } 
        else
        {
          console.log('Invoice Created: ', data);
          swal.fire({
            type: 'success',
            title: 'Invoice #' + data.invoice_number + ' created successfully!',
            showConfirmButton: false,
            timer: 1500,
            onClose: () => {
              this.$router.push({ path: 'invoices' });
            }
          });
        }
      } else {
        swal.fire({
          type: 'error',
          title: 'All fields must be filled',
          showConfirmButton: false,
          timer: 1500,
          onClose: () => {
            // this.advancedSearch = true;
          }
        });
      }
      
    },
    amountQnt () {
      this.editedItem.amount = (this.editedItem.unity_price * this.editedItem.quantity).toFixed(2).replace(/(\d)(?=(\d{5})+\.)/g, '$1,');
      this.editedItem.quantity = Number(this.editedItem.quantity);
    }
  }
};
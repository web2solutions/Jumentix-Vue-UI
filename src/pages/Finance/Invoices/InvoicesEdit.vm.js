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
  name: 'InvoicesEdit',
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
    invoiceID: null,
    invoice: null,
    invoiceLoaded: false
  }),
  mounted () {
    if (!this.bus) this.bus = new Vue();
    this.feedSelects('Wallet');
    this.feedSelects('Good');

    this.bus.$on('savedOnServer', (response) => {
      // console.log('savedOnServer', response);
      if (response.data) {
        swal.fire({
          type: 'success',
          title: 'Invoice #' + response.data.invoice_number + ' edited successfully!',
          showConfirmButton: false,
          timer: 2500,
          onClose: () => {
            this.$router.push({ path: '/invoices' });
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

      let walletID =  typeof this.drawee === 'string' ? this.drawee : this.drawee.ID;
      let obj = this.entriesWallet.find(obj => obj.ID === walletID);

      if (obj) {
        return Object.keys(obj).map(key => {
          return {
            key,
            value: obj[key] || 'n/a'
          };
        });
      }
      
    },
    itemsAmount () {
      let countItem = 0;
      for (let prop in this.items)
      {
        if (this.items.hasOwnProperty(prop))
        {
          countItem += this.items[prop].quantity * this.items[prop].unity_price;
        }
      }
      return countItem.toLocaleString(session.user().language, { style: 'currency', currency: session.user().currency_code });
    }
  },

  watch: {
    //
  },

  created () {
    this.invoiceID = this.$router.currentRoute.params.id;
    this.getInvoice(this.invoiceID);
    if (!this.bus) this.bus = new Vue();
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
    async getInvoice (id) {
      let { data, total, error } = await getOnLocalCollection('Invoice', id);
      if (error)
      {
        console.error('error get Invoices', error);
        return { data, error };
      } 
      else
      {
        console.log('getInvoice:', data);
        this.invoice = data;
        this.invoiceLoaded = true;
        this.drawee = data.drawee;
        // this.items = data.good;
        this.date_issue = new Date(data.createdAt).toISOString().substr(0, 10);
        this.due_date = new Date(data.due_date).toISOString().substr(0, 10);

        this.items = data.good.map(entry => {
          let newDoc = entry;
          newDoc['amount'] = (entry.quantity * entry.unity_price);
          return newDoc;
        });
        // return data;
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
      if (this.drawee !== null && this.drawee !== '' && this.drawee !== undefined) {
        let invoice = {
          // 'invoice_number': this.invoice_number,
          // 'order_number': this.order_number,
          'drawee': typeof this.drawee === 'string' ? this.drawee : this.drawee.ID,
          'due_date': this.due_date,
          'good': this.items,
          // 'payment_options': this.payment_options
        };

        this.bus.$emit('addToPayload', invoice);
        // console.log('editInvoice >>>>>>>>>>>>>>>>>>>>>>>', invoice);
        this.bus.$emit('save', true, false);
        
      } else {

        this.snack = true;
        this.snackText = 'Please select a Wallet';
        this.snackColor = 'error';
      }
    },
    amountQnt () {
      this.editedItem.amount = (this.editedItem.unity_price * this.editedItem.quantity).toFixed(2).replace(/(\d)(?=(\d{5})+\.)/g, '$1,');
      this.editedItem.quantity = Number(this.editedItem.quantity);
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
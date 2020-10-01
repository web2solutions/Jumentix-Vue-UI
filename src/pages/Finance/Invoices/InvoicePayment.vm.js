/* global session */
import { getOnLocalCollection, update, create } from '../../../helpers/helpers';
import session from '../../../helpers/session';
import swal from 'sweetalert2';
import MenuNav from '../MenuNav';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  name: 'InvoicePayment',
  components: {
    'component-menu-nav': MenuNav,
    VuePerfectScrollbar
  },
  data: () => ({
    invoice: [],
    amount: 0,
    disable_options_card: false,
    disable_options_check: true,
    disable_options_echeck: true,
    disable_options_stripe: false,
    saveCard: true,
    valid: true,
    form: {
      cardNumber: '',
      cardName: '',
      expireDate: '',
      check_number: 0,
      aba_number: 0,
      accountNumber: 0,
      address: '',
      city: '',
      state: '',
      country: '',
      zip: ''
    },


    stripe: null,
  }),
  computed: {
    
  },
  created () {
    let invoiceID = this.$router.currentRoute.params.id;
    this.getInvoice(invoiceID);

  },
  mounted () {
    

    console.log(window.Stripe);

    let stripe = window.Stripe('pk_test_WpRt8j2A7NnTHxgLKOFhGpvi00T2UZVI53');
    let elements = stripe.elements();

    let style = {
      base: {
        // Add your base input styles here. For example:
        fontSize: '16px',
        color: '#32325d',
      },
    };

    // Create an instance of the card Element.
    let card = elements.create('card', { style: style });

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');
  },
  methods: {
    async getInvoice (invoiceID) {
      let { error, data, status } = await getOnLocalCollection('Invoice', invoiceID);
      this.invoice = data;
      if (error) {
        console.log('ERROR GET Invoice: ', error);
      }
      else 
      {
        if (this.invoice['good'].length >= 1) {
          this.amount = 0;
          this.invoice['good'].forEach((element, index) => {
            this.amount = this.amount + (element.unity_price * element.quantity);
            this.invoice.amount = this.amount;
            console.log('amount: ', this.amount, this.invoice.amount, element);
          });
          this.amount = this.invoice.amount.toLocaleString(session.user().language, { style: 'currency', currency: session.user().currency_code });
        }
        if (this.invoice['status'] !== 'Paid') {
          this.invoice['payment_options'].forEach((element, index) => {
            console.log(element);
            switch (element) {
              case 'Credit Card':
                this.disable_options_card = false;
                break;

              case 'Check':
                this.disable_options_check = false;
                break;

              case 'eCheck':
                this.disable_options_echeck = false;
                break;
                  
              default:
                
            }
          });
        }
      }
    },
    async submit (type) {

      let valid = await this.$validator.validateAll(type);
      console.log('VALIDATE', this.$refs[type].validate());
      
      console.log('valid: ', valid);
      
      if (valid) {
        let address = [];

        if (type === 'Credit Card') {
          address = [{
            'type': 'Home',
            'line_1': this.form.address,
            'line_2': '',
            'city': this.form.city,
            'state': this.form.state,
            'country': this.form.country,
            'zip': this.form.zip
          }];
        }

        let transaction = {
          'transaction_type': type,
          'invoice': [this.invoice.id],
          'name': 'Transaction invoice #' + this.invoice.invoice_number,
          // 'info': [],
          'info': [{
            'type': type,
            'check_number': Number(this.form.check_number),
            'account_number': Number(this.form.accountNumber),
            'aba_number': Number(this.form.aba_number),
            'amount': Number(this.invoice.amount),
            'amount_minimum': Number(this.invoice.amount),
            'amount_paid': Number(this.invoice.amount),
            'date': new Date().toISOString(),
            'transaction_number': Date.now().toString(),
            'credit_card_processor': 'Authorize.net',
            'return_status': 'Initiated',
            'name': 'Transaction invoice #' + this.invoice.invoice_number,
            'signature': '5c78a060c15bca840749e44a',
            'address': address
            /* 'signature': {
              '_id': '5c78a060c15bca840749e44a',
              'signature': 'mySignature.jpg',
              'name': 'John Doe',
              'creation_date': '2019-07-21T17:32:28Z'
            },  */
          }],
          'good': this.invoice['good'],
          'amount': Number(this.invoice.amount),
          'amount_minimum': Number(this.invoice.amount),
          'drawee': this.invoice.drawee,
          'inquirer': this.invoice.drawee
        };

        
        
        console.log(transaction);
        let { error, data, status } = await create('Transaction', transaction);
        let transactionData = data;
        if (error) {
          console.log('ERROR PUT Transaction: ', error);
        }
        else 
        {
          console.log(transactionData);

          let invoiceUpdate = {
            '_id': this.invoice.id,
            'invoice_number': this.invoice.invoice_number,
            'due_date': new Date(this.invoice.due_date).toISOString().substr(0, 10),
            'order_number': this.invoice.order_number,
            'transaction': [
              transactionData.id
            ],
            'status': 'Paid',
            'paid_date': new Date().toISOString().substr(0, 10),
            'drawee': this.invoice.drawee,
          };
          // console.log('Update Invoice: ', invoiceUpdate);
          let { error, data, status } = await update('Invoice', invoiceUpdate, this.invoice.id);
          if (error) {
            console.log('ERROR UPDATE Invoice: ', error);
          }
          else 
          {  
            let timerInterval;
            swal.fire({
              title: 'Please wait, performing payment!',
              html: 'Validating Payment!<br>Estimated time <strong></strong> seconds.',
              timer: 5000,
              onBeforeOpen: () => {
                swal.showLoading();
                timerInterval = setInterval(() => {
                  swal.getContent().querySelector('strong')
                    .textContent = (swal.getTimerLeft() / 1000)
                      .toFixed(0);
                }, 100);
              },
              onClose: () => {
                clearInterval(timerInterval);
              }
            }).then((result) => {
              if (
                result.dismiss === swal.DismissReason.timer
              ) {
                swal.fire({
                  type: 'success',
                  title: 'Payment made successfully',
                  showConfirmButton: false,
                  timer: 2500,
                  onClose: () => {
                    this.$router.push({ path: '/invoices' });
                  }
                });
              }
            });
            console.log('Update Invoice: ', data);
          }
        }
      }
    },
    clear () {
      this.form = {};
      this.$validator.reset();
    }


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
  beforeRouteUpdate (to, from, next) {
    let invoiceID = to.params.id;
    this.getInvoice(invoiceID);
    next();
  }
};

/* global session */
import Vue from 'vue';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import NameCard from '@/components/widgets/card/NameCard';
import ProfileCard from '@/components/widgets/card/ProfileCard';
import is from 'is_js';
import session from '../../helpers/session';
import { fillField, getLocalCollection, previewSubFormItem, previewGenericItem } from '../../helpers/helpers';
import xSimpleForm from '@/components/xCRUD/xSimpleForm.vue';
import messages from '@/api/message';
import moment from 'moment-timezone';
// 
export default {
  components: {
    VuePerfectScrollbar,
    NameCard,
    ProfileCard,
    xSimpleForm
  },
  name: 'AccountInfo',
  data: () => ({
    entity: 'Human',
    items: messages,
    accesslist: session.user().access,
    grouplist: session.user().human.group,
    caselist: session.user().human.case,
    relationshiplist: session.user().human.human_relationship,
    casenotelist: [],
    defaultTab: null,
    currentTab: 'overview',
    mini: false,
    scrollSettings: {
      maxScrollbarLength: 160
    },
    cardBgImage: session.user().bgImg ? session.user().bgImg : '/static/bg/user-panel-bg.png',
    role: session.user().role,
    name: session.user().name,
    dark: session.user().portal_isDark ? true : false,
    avatar: {
      src: session.user().avatar,
      size: '128'
    },
    status: is.online() ? 'online' : 'offline',
    color: session.user().portal_color,
    bus: false
  }),
  computed: {
    session () {
      return this.store.state.session;
    },
    swagger () {
      return this.store.state.swagger;
    },
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
  watch: {
    session: {
      handler () {
        if (!this.session.user) return;
        // console.log('watched session on Account INFO', this.session);
        this.setupUser();
      },
      deep: true
    }
  },
  created: function () {
    if (!this.bus) this.bus = new Vue();
  },
  mounted () {
    // this.setupUser();
    if (!this.bus) this.bus = new Vue();
    // console.log(session.user().human.group);

    // this.defaultTab = 'overview';
    this.getCaseNotes();

    console.log(session.user());


    console.log('session.user().language', session.user().language);

    let stripe = window.Stripe('pk_test_WpRt8j2A7NnTHxgLKOFhGpvi00T2UZVI53', { locale: session.user().language });
    let elements = stripe.elements({ locale: session.user().language });

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

    card.on('change', function (event) {
      /*
      {
        complete: false,
        brand: 'visa',
        elementType: 'card',
        empty: false,
        error: undefined,
        value: { postalCode: "" },
      }
      */
      if (event.complete) {
        // enable payment button
      } else if (event.error) {
        // show validation to customer
      }
    });


    let form = document.getElementById('payment-form');
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      stripe.createToken(card, { 
        /* name
        address_line1
        address_line2
        address_city
        address_state
        address_zip
        address_country */
        // currency
      }).then(function (result) {
        if (result.error) {
          // Inform the customer that there was an error.
          let errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          // Send the token to your server.
          // stripeTokenHandler(result.token);
          console.log(result);
        }
      });
    });
  },
  methods: {
    xfillField (collection, _id, fieldId) {
      // console.log('------------>>>>> filling field');
      fillField(this, collection, _id, fieldId);
    },
    handleClick (item, formName, index) {
      // console.log(event);
      previewSubFormItem(this, item, formName, index, this.entity);  
    },
    handleClickGeneric (item, formName, index) {
      // console.log(event);
      previewGenericItem(this, item, formName, index);  
    },
    showdiagram (item, formName, index) {
      // console.log(event);
      previewGenericItem(this, item, formName, index);  
    },
    async getCaseNotes () {
      let {
        error,
        data
      } = await getLocalCollection('CaseNote');
      // console.log(data, error);
      this.casenotelist = data;
    },
    showTab (id) {
      this.currentTab = id;
      if (id === 'personal_information') this.entity = 'Human';
      if (id === 'account_information') this.entity = 'User';
      if (id === 'overview') this.entity = 'Human';
      if (id === 'access') this.entity = 'User';
      if (id === 'relationships')
      {
        this.entity = 'Human';
      }
      // console.log(this);
    },
    feedAccess (id) {
      this.currentTab = id;
    },
    setupUser () {
      if (!this.session.user) return;
      console.log('watched session on Account INFO', this.session);
      if (this.session.user.avatar) this.avatar.src = this.session.user.avatar;
      if (this.session.user.name) this.name = this.session.user.name;
      if (this.session.user.role) this.role = this.session.user.role;
      if (this.session.user.bgImg) this.cardBgImage = this.session.user.bgImg;
      this.dark = this.session.user.portal_isDark;
      if (this.session.user.portal_color) this.color = this.session.user.portal_color;
      if (is.online()) 
      {
        this.status = 'online';
      }
      else 
      {
        this.status = 'offline';
      }
    }
  }
};

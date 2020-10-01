/* global session moment store */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { getFromApi, create, update, getLocalCollection } from '../../helpers/helpers';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as is from 'is_js'

import Country from '@/api/country';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'Agency',
  props: {
    bus: {
      type: Object,
      default: function () { return {} },
    }
  },
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    hasOrganization: false,
    loading: false,
    countrys: Country,
    selected: [],
    rules: {
      required: value => !!value || 'Required.',
      email: value => is.email(value) || 'Invalid e-mail.',
    },
    headers: [
      {
        text: 'STEP',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'STATUS', sortable: false, align: 'right', value: 'status' }
    ],
    organization: {
      name: '',
      feid_number: '',
      referral_source: '',
      license_number: '',
      license_expire_date: '',
      services: [],
      human: [],
      email: [],
      address: [],
      phone: [],
      system_owner: true
    },
    phoneSchema: {
      type: 'Work',
      country_code: '+1',
      area_number: '',
      number: '',
      isDefault: true
    },
    emailSchema: {
      type: 'Work',
      email: '',
      isDefault: true
    },
    emailSchemaDefault: {
      type: 'Work',
      email: '',
      isDefault: true
    },
    addressSchema: {
      type: 'Work',
      line_1: '',
      line_2: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States of America',
      isDefault: true
    },
    addressSchemaDefault: {
      type: 'Work',
      line_1: '',
      line_2: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States of America',
      isDefault: true
    },
    servicesItem: [],
    license_expire_date_picker: false,
    emailDialog: false,
    valid: true,
    emailHeaders: [
      {
        text: 'Email',
        align: 'left',
        value: 'emailSchema.email'
      },
      { text: 'Type', value: 'emailSchema.type' },
      { text: 'Is Deafult', value: 'emailSchema.isDefault' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    editedEmailIndex: -1,
    emails: [],
    addressDialog: false,
    addressHeaders: [
      {
        text: 'Address',
        align: 'left',
        value: 'addressSchema.line_1'
      },
      { text: 'Type', value: 'addressSchema.type' },
      { text: 'Is Deafult', value: 'addressSchema.isDefault' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    editedAddressIndex: -1,
    addresss: [],
    country: ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua &amp; Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L` Este', 'Togo', 'Tonga', 'Trinidad &amp; Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'],
    phoneDialog: false,
    phoneHeaders: [
      {
        text: 'Phone',
        align: 'left',
        value: 'phoneSchema.phone'
      },
      { text: 'Type', value: 'phoneSchema.type' },
      { text: 'Is Deafult', value: 'phoneSchema.isDefault' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    editedphoneIndex: -1,
    phones: [],
  }),
  computed: {
    computedLicenseExpireDate (e) {
      return this.organization.license_expire_date ? moment(this.organization.license_expire_date).format('L') : '';
    },
    emailFormTitle () {
      return this.editedEmailIndex === -1 ? 'New Email' : 'Edit Email';
    },
    addressFormTitle () {
      return this.editedaddressIndex === -1 ? 'New Address' : 'Edit Address';
    },
    phoneFormTitle () {
      return this.editedPhoneIndex === -1 ? 'New Phone' : 'Edit Phone';
    }
  },
  watch: {

  },
  created () {
    // let self = this;
  },
  mounted () {
    this.checkOrganization();
    this.feedSelects('Service');
    // this.$vuetify.goTo('#agencyTop');
    // console.log('bus >>>>', this.bus);
    console.log('state.setup >>>>', this.hasOrganization, store.state.setup, is.empty(store.state.setup), is.empty(JSON.stringify(store.state.setup)));
  },
  methods: {
    async checkOrganization () {
      // let where = { system_owner: true };
      let where = '';
      let { error, data } = await getLocalCollection('Organization');
      if (error)
      {
        console.error('error on load', error);
        this.snackbar = {
          show: true,
          color: 'red',
          text: error
        };
        return { data, error };
      } 
      else
      {
        console.log('Data >>>> ', data);
        if (data.length > 0) {
          this.hasOrganization = true;
          store.commit('setSetup', data[0]);
          Object.assign(this.organization, store.state.setup);
          console.log('Organization loaded successfully - id: ', store.state.setup._id, data[0], store.state.setup);
        }
        
      }
    },
    goToUrl (e) {
      this.$router.push({ path: '/setup/' + e });
    },

    editItem (item, e) {
      switch (e) {
        case 'address':
          this.editedAddressIndex = this.organization.address.indexOf(item);
          this.addressSchema = Object.assign({}, item);
          this.addressDialog = true;
          break;

        case 'phone':
          this.editedPhoneIndex = this.organization.phone.indexOf(item);
          this.phoneSchema = Object.assign({}, item);
          this.phoneDialog = true;
          break;

        case 'email':
          this.editedEmailIndex = this.organization.email.indexOf(item);
          this.emailSchema = Object.assign({}, item);
          this.emailDialog = true;
          break;
        default:
          break;
      }
    },

    deleteItem (item, e) {
      let index = null;
      index = this.organization[e].indexOf(item);
      Swal.fire({
        title: 'Delete item?',
        text: 'You won\'t be able to revert this!',
        type: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete it!',
        /* backdrop: `
            rgba(0,0,123,0.4)
            url("./static/nyan-cat.gif")
            center left
            no-repeat
          ` */
      }).then((result) => {
        if (result.value) {
          this.organization[e].splice(index, 1)
          Swal.fire('Deleted!', 'Now you need to save the main form to save the changes.', 'warning')
        }
      })
      
    },
    close (item) {
      switch (item) {
        case 'email':
          this.emailDialog = false;
          setTimeout(() => {
            this.emailSchema = Object.assign({}, this.emailSchemaDefault);
            this.editedEmailIndex = -1;
          }, 300);
          break;

        case 'phone':
          this.phoneDialog = false;
          setTimeout(() => {
            this.phoneSchema = Object.assign({}, this.phoneSchemaDefault);
            this.editedPhoneIndex = -1;
          }, 300);
          break;

        case 'address':
          this.addressDialog = false;
          setTimeout(() => {
            this.addressSchema = Object.assign({}, this.addressSchemaDefault);
            this.editedAddressIndex = -1;
          }, 300);
          break;
  
        default:
          break;
      }
    },

    save (item) {
      console.log('Save >>>> ', item, this.hasOrganization, is.empty(JSON.stringify(store.state.setup)), this.$refs[item].validate());
      if (this.$refs[item].validate() === true) {
        switch (item) {

          case 'email':
            if (this.emailSchema.isDefault === true) {
              this.organization.email.forEach((item, index) => {
                if (item.email !== this.emailSchema.email) this.organization.email[index].isDefault = false;
              });
            }
            
            if (this.editedEmailIndex > -1) {
              Object.assign(this.organization.email[this.editedEmailIndex], this.emailSchema);
            } else {
              this.organization.email.push(this.emailSchema);
            }
            break;
          
          case 'phone':

            if (this.phoneSchema.isDefault === true) {
              this.organization.phone.forEach((item, index) => {
                if (item.number !== this.phoneSchema.number) this.organization.phone[index].isDefault = false;
              });
            }

            if (this.editedPhoneIndex > -1) {
              Object.assign(this.organization.phone[this.editedPhoneIndex], this.phoneSchema);
            } else {
              this.organization.phone.push(this.phoneSchema);
            }
            break;

          case 'address':

            if (this.addressSchema.isDefault === true) {
              this.organization.address.forEach((item, index) => {
                if (item.line_1 !== this.addressSchema.line_1) this.organization.address[index].isDefault = false;
              });
            }

            if (this.editedAddressIndex > -1) {
              Object.assign(this.organization.address[this.editedAddressIndex], this.addressSchema);
            } else {
              this.organization.address.push(this.addressSchema);
            }
            break;
          
          case 'agency':
            // Object.assign(this.organization, store.state.setup);
            // console.log('state.setup >>>>>>>>>>>>>>>>>>>>>>>>>>', store.state.setup);
            // console.log('agency isEmpty >>>>>>> ', is.empty(store.state.setup));
            this.organization.license_expire_date = this.organization.license_expire_date ? new Date().toISOString().substr(0, 10) : '';
            if (this.hasOrganization === true) {
              this.updateOrganization();
            } else {
              this.createOrganization();
            }
            
            break;
        
          default:
            break;
        }
        
        this.close(item);

      } else {
        this.$vuetify.goTo('#' + item + 'Top');
        Swal.fire(
          'Attention!',
          'All required fields must be completed.',
          'warning'
        );
      }
    },
    async createOrganization () {
      const ObjectID = require('bson-objectid');
      this.organization._id = (ObjectID()).toString();

      console.log('Organization Create payload >>>>>>>>> ', this.organization);
      let { error, data } = await create('Organization', this.organization);
      if (error)
      {
        console.error('error on load', error);
        this.snackbar = {
          show: true,
          color: 'red',
          text: error
        };
        return { data, error };
      } 
      else
      {
        store.commit('setSetup', data);
        console.log('Organization created successfully', data, store.state.setup);
        this.bus.$emit('nextStep', 3);
      }
    },
    async updateOrganization () {
      console.log('Organization Update PAYLOAD >>>>>>>>> ', this.organization);
      let { error, data } = await update('Organization', this.organization, store.state.setup._id);
      if (error)
      {
        console.error('error on load', error);
        this.snackbar = {
          show: true,
          color: 'red',
          text: error
        };
        return { data, error };
      } 
      else
      {
        store.commit('setSetup', data);
        console.log('Organization updated successfully', data, store.state.setup);
        this.bus.$emit('nextStep', 3);
      }
    },
    async feedSelects (entity) {
      let { data, total, error } = await getLocalCollection(entity, this);
      if (error) {
        console.log(error);
      } else {
        // console.log(entity, data);
        switch (entity) {
          case 'Service':
            this.servicesItem = data;
            break;
          case 'Human':
            this.authorItems = data;
            break;
        
          default:
            break;
        }
        
      }
    },
    maskPhone (e) {
      let np = e.replace('-', '');
      this.phoneSchema.number = np.replace(/\D+/g, '');

      if (np.length === 7) {
        this.phoneSchema.number = np.substr(0, 3) + '-' + np.substr(3, np.length);
      }
      if (np.length === 8) {
        this.phoneSchema.number = np.substr(0, 4) + '-' + np.substr(4);
      }
      if (np.length === 9) {
        this.phoneSchema.number = np.substr(0, 5) + '-' + np.substr(5, np.length);
      }
      
    }
  }
};

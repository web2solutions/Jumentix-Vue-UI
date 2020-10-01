/* global session moment */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { create, update, getFromApi, getOnLocalCollection } from '../../helpers/helpers';
import Country from '@/api/country';
import is from 'is_js';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'Users',
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
      rowsPerPage: 1000, // -1 for All
    },
    loading: false,
    countrys: Country,
    selected: [],
    rules: {
      required: value => !!value || 'Required.',
      ssn_is: value => is.socialSecurityNumber(value) || 'Invalid SSN.',
      ssn: value => {
        const pattern = /^(?!666|000|9\d{2})\d{3}[- ]{0,1}(?!00)\d{2}[- ]{0,1}(?!0{4})\d{4}$/;
        return pattern.test(value) || 'Invalid SSN.';
      },
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      }
    },
    countryItems: ['Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguans', 'Argentinean', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djibouti', 'Dominican', 'Dutch', 'East Timorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinea-Bissauan', 'Guinean', 'Guyanese', 'Haitian', 'Herzegovinian', 'Honduran', 'Hungarian', 'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'New Zealander', 'Nicaraguan', 'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Salvadoran', 'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovakian', 'Slovenian', 'Solomon Islander', 'Somali', 'South African', 'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean'],
    genderTypeItems: [
      'Male',
      'Female',
      'Female to Male',
      'Male to Female',
      'In Transition',
      'Other',
      'Unknown'
    ],
    sexualPrefTypeItems: [
      'Heterosexual/Straight',
      'Gay/Lesbian',
      'Other',
      'Prefer Not to Answer',
      'Unknown'
    ],
    human: {
      user: '',
      first_name: '',
      last_name: '',
      nationality: 'American',
      email: [],
      address: [],
      phone: [],
      gender: 'Male',
      sexual_orientation: 'Heterosexual/Straight',
      photo: '/static/avatar.png',
      birthDate: '',
      ssn: '',
      memo: [],
    },
    humanDefault: {
      user: '',
      first_name: '',
      last_name: '',
      nationality: 'American',
      email: [],
      address: [],
      phone: [],
      gender: 'Male',
      sexual_orientation: 'Heterosexual/Straight',
      photo: '/static/avatar.png',
      birthDate: '',
      ssn: '',
      memo: [],
    },
    humanPicker: false,
    user: {
      human: [],
      password: '',
      roles: 'admin',

    },
    userDefault: {
      human: [],
      password: '',
      roles: 'admin',

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
    servicesItem: ['Adoptions Services', 'Counseling Services', 'Medical Services', 'Software Development'],
    usersDialog: false,
    valid: true,
    usersHeaders: [
      {
        text: 'Name',
        align: 'left',
        value: 'human.first_name'
      },
      { text: 'Username', value: 'human.user' },
      { text: 'System Roles', value: 'human.roles' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    editedusersIndex: -1,
    usersItems: [],
    emailDialog: false,
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
      // { text: 'Line 2', value: 'addressSchema.line_2' },
      // { text: 'City', value: 'addressSchema.city' },
      // { text: 'State', value: 'addressSchema.state' },
      // { text: 'Zip', value: 'addressSchema.zip' },
      // { text: 'Country', value: 'addressSchema.country' },
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
    SSNShow: false,
    passwordShow: false,
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
      system_owner: ''
    },
    organizationPicker: false,
    organizationHumanRelationSchema: {
      human: [],
      role: [],
      startDate: ''
    },
    organizationHeaders: [
      {
        text: 'Organization',
        align: 'left',
        value: 'organizationSchema.name', 
        sortable: false
      }
    ],
    organizationItem: [],
    organizationItemOFF: [
      { id: 1, name: 'Barker Adoption Foundation' },
      { id: 1, name: 'Be Happy Adoption Foundation' },
      { id: 1, name: 'The Best Adoption Foundation' }
    ],
    roleItems: [],
    roleValues2: ['admin', 'agency', 'caseworker', 'child', 'manager', 'parent'],
    roleValues: [{ name: 'Admin', value: 'admin' }, { name: 'Agency', value: 'agency' }, { name: 'Caseworker', value: 'caseworker' }, { name: 'Caseworker and Manager', value: 'manager' }, { name: 'Child', value: 'child' }, { name: 'Manager', value: 'manager' }, { name: 'Parent', value: 'parent' }]
  }),
  computed: {
    computedBirthDate (e) {
      return this.human.birthDate ? moment(this.human.birthDate).format('L') : '';
    },
    computedOrganizationStartDate (e) {
      return this.organizationHumanRelationSchema.startDate ? moment(this.organizationHumanRelationSchema.startDate).format('L') : '';
    },
    usersFormTitle () {
      return this.editedusersIndex === -1 ? 'New users' : 'Edit users';
    },
    emailFormTitle () {
      return this.editedEmailIndex === -1 ? 'New Email' : 'Edit Email';
    },
    addressFormTitle () {
      return this.editedaddressIndex === -1 ? 'New Address' : 'Edit Address';
    },
    phoneFormTitle () {
      return this.editedPhoneIndex === -1 ? 'New Phone' : 'Edit Phone';
    },
    formattedSSN () {
      return `${this.human.ssn.substr(0, this.human.ssn.length - 4).replace(/[\w]/g, 'X')}${this.human.ssn.substr(-4)}`;
    }
  },
  watch: {

  },
  created () {
    // let self = this;
  },
  mounted () {
    this.feedItems('Human');
    this.feedItems('Role');
    this.feedItems('Organization');
  },
  methods: {
    goToUrl (e) {
      this.$router.push({ path: '/setup/' + e });
    },

    editItem (item, e) {
      console.log(e, item);
      switch (e) {
        case 'address':
          this.editedAddressIndex = this.addresss.indexOf(item);
          this.addressSchema = Object.assign({}, item);
          this.addressDialog = true;
          break;

        case 'phone':
          this.editedPhoneIndex = this.phones.indexOf(item);
          this.phoneSchema = Object.assign({}, item);
          this.phoneDialog = true;
          break;

        case 'email':
          this.editedEmailIndex = this.emails.indexOf(item);
          this.emailSchema = Object.assign({}, item);
          this.emailDialog = true;
          break;

        case 'users':
          this.usersDialog = true;
          this.editedusersIndex = this.usersItems.indexOf(item);
          this.user = Object.assign({}, item.user);
          this.addressSchema = Object.assign({}, item.address);
          this.phoneSchema = Object.assign({}, item.phone);
          this.emails = item.email;
          this.phones = item.phone;
          this.addresss = item.address;
          this.human = Object.assign(this.human, item);
          this.human.birthDate = this.human.birthDate !== '' ? new Date(this.human.birthDate).toISOString().substr(0, 10) : '';
          this.user.roles = this.user.roles ? this.user.roles.toString() : [];
          break;
        default:
          break;
      }

      console.log('Edit this.human', this.human);
      console.log(e, item);
    },

    deleteItem (item, e) {
      let index = null;
      switch (e) {

        case 'users':
          index = this.usersItems.indexOf(item);
          confirm('Are you sure you want to delete this item?') && this.usersItems.splice(index, 1);
          break;

        case 'address':
          index = this.addresss.indexOf(item);
          confirm('Are you sure you want to delete this item?') && this.addresss.splice(index, 1);
          break;

        case 'email':
          index = this.emails.indexOf(item);
          confirm('Are you sure you want to delete this item?') && this.emails.splice(index, 1);
          break;

        case 'phone':
          index = this.phones.indexOf(item);
          confirm('Are you sure you want to delete this item?') && this.phones.splice(index, 1);
          break;

        default:
          break;
      }
      
    },
    close (item) {
      switch (item) {
        case 'users':
          this.usersDialog = false;
          setTimeout(() => {
            this.human = Object.assign({}, this.humanDefault);
            this.user = Object.assign({}, this.userDefault);
            this.phoneSchema = Object.assign({}, this.phoneSchemaDefault);
            this.emailSchema = Object.assign({}, this.emailSchemaDefault);
            this.emails = [];
            this.phones = [];
            this.address = [];
            this.addressSchema = Object.assign({}, this.addressSchemaDefault);
            this.editedusersIndex = -1;
          }, 300);
          break;

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
      if (this.$refs[item].validate() === true) {
        switch (item) {
          case 'users':
            this.human.user = this.user;
            this.human.email = this.emails;
            this.human.phone = this.phones;
            this.human.address = this.addresss;

            if (this.editedusersIndex > -1) {
              Object.assign(this.usersItems[this.editedusersIndex], this.human);
              this.human.user = this.user._id;
              this.user.roles = this.user.roles ? this.user.roles.split() : [];
              this.update('Human', this.human, this.human._id);
              this.update('User', this.user, this.user._id)
            } else {
              // this.usersItems.push(this.human);
              this.createHuman(this.human);
            }
            break;

          case 'email':

            if (this.emailSchema.isDefault === true) {
              this.user.username = this.emailSchema.email;
              this.emails.forEach((item, index) => {
                if (item.email !== this.emailSchema.email) this.emails[index].isDefault = false;
              });
            }

            if (this.editedEmailIndex > -1) {
              Object.assign(this.emails[this.editedEmailIndex], this.emailSchema);
            } else {
              this.emails.push(this.emailSchema);
            }
            this.human.email = this.emails;
            this.close(item);
            break;
          
          case 'phone':

            if (this.phoneSchema.isDefault === true) {
              this.phones.forEach((item, index) => {
                if (item.number !== this.phoneSchema.number) this.phones[index].isDefault = false;
              });
            }

            if (this.editedPhoneIndex > -1) {
              Object.assign(this.phones[this.editedPhoneIndex], this.phoneSchema);
            } else {
              this.phones.push(this.phoneSchema);
            }

            this.close(item);
            break;

          case 'address':

            if (this.addressSchema.isDefault === true) {
              this.addresss.forEach((item, index) => {
                if (item.line_1 !== this.addressSchema.line_1) this.addresss[index].isDefault = false;
              });
            }

            if (this.editedAddressIndex > -1) {
              Object.assign(this.addresss[this.editedAddressIndex], this.addressSchema);
            } else {
              this.addresss.push(this.addressSchema);
            }

            this.close(item);
            break;
        
          default:
            break;
        }

        console.log(item, this.human, this.$refs[item].validate());
        this.$forceUpdate();
        // this.close(item);

      } else {
        Swal.fire(
          'Attention!',
          'All required fields must be completed.',
          'warning'
        );
        this.$vuetify.goTo('#usersTop');
        
      }
    },
    async createHuman (payload) {
      let payloadUser = payload.user;
      if (payload.birthDate === '') delete payload.birthDate;
      delete payload.user;
      console.log('Human create payload >>>>>>>>> ', payload);
      let { error, data } = await create('Human', payload);
      if (error)
      {
        console.error('error on load', error);
        return { data, error };
      } 
      else
      {
        console.log('Human Created successfully', data);
        payloadUser.human = data._id;
        this.createUser(payloadUser, data);

        this.organizationHumanRelationSchema.human = data._id;
        this.organizationHumanRelationSchema.startDate = new Date(this.organizationHumanRelationSchema.startDate).toISOString();
        let payloadOrganization = {};
        payloadOrganization._id = this.selected[0]._id;
        payloadOrganization.name = this.selected[0].name;
        payloadOrganization.human = [];
        payloadOrganization.human.push(this.organizationHumanRelationSchema);
        this.update('Organization', payloadOrganization, payloadOrganization._id)
      }
    },
    async createUser (payload, human) {
      payload.roles = payload.roles.split(); 
      console.log('User create payload >>>>>>>>> ', payload);
      let { error, data } = await create('User', payload);
      if (error)
      {
        console.error('error on load', error);
        return { data, error };
      } 
      else
      {
        console.log('User Created successfully', data);
        human.user = data._id;
        human.birthDate = human.birthDate !== '' ? new Date(human.birthDate).toISOString().substr(0, 10) : '';
        this.update('Human', human, human._id)
      }
    },
    async update (item, payload, id) {
      console.log(item, ' updated payload >>>>>>>>> ', id, payload);
      let { error, data } = await update(item, payload, id);
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
        console.log(item, ' updated successfully', data);
        this.feedItems('Human');

        this.close('users');
      }
    },
    async feedItems (entity) {
      let populate = entity === 'Human' ? 'user' : '';
      let where = entity === 'Role' ? { type: 'Service' } : false;

      let { data, total, error } = await getFromApi(entity, this, where, populate);
      if (error) {
        console.log(error);
      } else {
        console.log(entity, data);
        switch (entity) {
          case 'Human':
            this.usersItems = data;
            // this.usersItems.user.roles = this.usersItems.user.roles.toString();
            break;
          case 'Role':
            this.roleItems = data;
            
            break;
          
          case 'Organization':
            this.organizationItem = data;

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
      
    },
    rowClick (selectedItem) {  
      this.selected = [selectedItem];
    }
  }
};

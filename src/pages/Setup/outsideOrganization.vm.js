/* global session moment */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { getFromApi, create, update, remove } from '../../helpers/helpers';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import is from 'is_js';
import Country from '@/api/country';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'Organization',
  props: {
    bus: {
      type: Object,
      default: function () { return {} },
    }
  },
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: false,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    loading: false,
    countrys: Country,
    selected: [],
    rules: {
      required: value => !!value || 'Required.',
      ssn_is: value => is.socialSecurityNumber(value) || 'Invalid SSN.',
      email: value => is.email(value) || 'Invalid e-mail.',
    },
    organizationDialog: false,
    headers: [
      {
        text: 'STEP',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'STATUS', sortable: false, align: 'right', value: 'status' }
    ],
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
    },
    humanPicker: false,
    user: {
      human: [],
      password: '',
      roles: 'staff'
    },
    userDefault: {
      human: [],
      password: '',
      roles: 'staff'
    },
    organizationSchema: {
      name: '',
      feid_number: '',
      referral_source: '',
      services: [],
      human: [],
      email: [],
      address: [],
      phone: []
    },
    organizationSchemaDefault: {
      name: '',
      feid_number: '',
      referral_source: '',
      services: [],
      human: [],
      email: [],
      address: [],
      phone: []
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
    members: [],
    emailDialog: false,
    outOrganizationHeaders: [
      {
        text: 'Name',
        align: 'left',
        value: 'organizationSchema.name'
      },
      { text: 'FEID Number', value: 'organizationSchema.feid_number' },
      { text: 'Phone', value: 'organizationSchema.phone' },
      { text: 'Email', value: 'organizationSchema.email' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    editedOrganizationIndex: -1,
    organizations: [],
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
    emailOrgDialog: false,
    editedEmailOrgIndex: -1,
    emailsOrg: [],
    phoneOrgDialog: false,
    editedPhoneOrgIndex: -1,
    phonesOrg: [],
    addressOrgDialog: false,
    editedAddressOrgIndex: -1,
    addresssOrg: [],
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
      startDate: '',
    },
    organizationHeaders: [
      {
        text: 'Organization',
        align: 'left',
        value: 'organizationSchema.name', 
        sortable: false
      }
    ],
    organizationItem: [
      { id: 1, name: 'Barker Adoption Foundation' },
      { id: 1, name: 'Be Happy Adoption Foundation' },
      { id: 1, name: 'The Best Adoption Foundation' }
    ],
    roleItems: []
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
    organizationFormTitle () {
      return this.editedOrganizationIndex === -1 ? 'New Organization' : 'Edit Organization';
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
    // this.$vuetify.goTo('#outsideOrganizationTop');
    const ObjectID = require('bson-objectid');
    let newID = {};
    newID._id = (ObjectID()).toString();
    console.log('newID >>>>>>>>>>>>>>>>>>> ', ObjectID(), newID);
    this.feedSelects('Service');
    this.feedSelects('Organization');
    this.feedSelects('Role');
  },
  methods: {
    goToUrl (e) {
      this.$router.push({ path: '/setup/' + e });
    },

    editItem (item, e) {
      switch (e) {
        case 'organization':
          console.log(item);
          this.editedOrganizationIndex = this.organizations.indexOf(item);
          this.organizationSchema = Object.assign({}, item);
          if (this.organizationSchema.human.length > 0) {
            let humanList = [];
            this.organizationSchema.human.forEach(human => {
              console.log(item, this.organizationSchema.human, 'this.organizationSchema.human', human);
              humanList.push({ _id: human.human })
            });
            this.getHuman('Human', humanList);
          }
          
          this.organizationDialog = true;
          break;

        case 'address':
          this.editedAddressIndex = this.addresss.indexOf(item);
          this.addressSchema = Object.assign({}, item);
          this.addressDialog = true;
          break;

        case 'addressOrg':
          this.editedAddressOrgIndex = this.organizationSchema.address.indexOf(item);
          this.addressSchema = Object.assign({}, item);
          this.addressOrgDialog = true;
          break;

        case 'phone':
          this.editedPhoneIndex = this.phones.indexOf(item);
          this.phoneSchema = Object.assign({}, item);
          this.phoneDialog = true;
          break;

        case 'phoneOrg':
          this.editedPhoneOrgIndex = this.organizationSchema.phone.indexOf(item);
          this.phoneSchema = Object.assign({}, item);
          this.phoneOrgDialog = true;
          break;
  

        case 'email':
          this.editedEmailIndex = this.emails.indexOf(item);
          this.emailSchema = Object.assign({}, item);
          this.emailDialog = true;
          break;

        case 'emailOrg':
          this.editedEmailOrgIndex = this.organizationSchema.email.indexOf(item);
          this.emailSchema = Object.assign({}, item);
          this.emailOrgDialog = true;
          break;

        case 'users':
          this.usersDialog = true;
          this.editedusersIndex = this.members.indexOf(item);
          this.user = Object.assign({}, item.user);
          this.addressSchema = Object.assign({}, item.address);
          this.phoneSchema = Object.assign({}, item.phone);
          this.emails = item.email;
          this.phones = item.phone;
          this.addresss = item.address;
          this.human = Object.assign({}, item);
          break;

        default:
          break;
      }
    },

    deleteItem (item, e) {
      let index = null;

      Swal.fire({
        title: 'Delete item?',
        text: 'You won\'t be able to revert this!',
        type: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete it!'
      }).then((result) => {
        if (result.value) {
          console.log('>>>>>>>>>>>>', result, e, item);
          switch (e) {
            case 'organization':
              index = this.organizations.indexOf(item);
              this.organizations.splice(index, 1);
              this.delete('Organization', item._id)
              // confirm('Are you sure you want to delete this item?') && this.organizations.splice(index, 1);
              break;

            case 'address':
              index = this.addresss.indexOf(item);
              this.addresss.splice(index, 1);
              // confirm('Are you sure you want to delete this item?') && this.addresss.splice(index, 1);
              break;

            case 'addressOrg':
              index = this.organizationSchema.address.indexOf(item);
              this.organizationSchema.address.splice(index, 1);
              // confirm('Are you sure you want to delete this item?') && this.organizationSchema.address.splice(index, 1);
              break;

            case 'email':
              index = this.emails.indexOf(item);
              this.emails.splice(index, 1);
              // confirm('Are you sure you want to delete this item?') && this.emails.splice(index, 1);
              break;


            case 'emailOrg':
              index = this.organizationSchema.email.indexOf(item);
              this.organizationSchema.email.splice(index, 1);
              // confirm('Are you sure you want to delete this item?') && this.organizationSchema.email.splice(index, 1);
              break;
          
            case 'phone':
              index = this.phones.indexOf(item);
              this.phones.splice(index, 1);
              // confirm('Are you sure you want to delete this item?') && this.phones.splice(index, 1);
              break;
          
            case 'phoneOrg':
              index = this.organizationSchema.phone.indexOf(item);
              this.organizationSchema.phone.splice(index, 1);
              // confirm('Are you sure you want to delete this item?') && this.organizationSchema.phone.splice(index, 1);
              break;

            case 'users':
              index = this.members.indexOf(item);
              this.members.splice(index, 1);
              // confirm('Are you sure you want to delete this item?') && this.members.splice(index, 1);
              break;


            default:
              break;
          }
          Swal.fire('Deleted!', 'Now you need to save the main form to save the changes.', 'warning')
        }
      })
    },
    close (item) {
      switch (item) {
        case 'organization':
          this.organizationDialog = false;
          setTimeout(() => {
            this.organizationSchema = Object.assign({}, this.organizationSchemaDefault);
            this.editedOrganizationIndex = -1;
            this.members = [];
          }, 300);
          break;

        case 'email':
          this.emailDialog = false;
          setTimeout(() => {
            this.emailSchema = Object.assign({}, this.emailSchemaDefault);
            this.editedEmailIndex = -1;
          }, 300);
          break;

        case 'emailOrg':
          this.emailOrgDialog = false;
          setTimeout(() => {
            this.emailSchema = Object.assign({}, this.emailSchemaDefault);
            this.editedEmailOrgIndex = -1;
          }, 300);
          break;
  
        case 'phone':
          this.phoneDialog = false;
          setTimeout(() => {
            this.phoneSchema = Object.assign({}, this.phoneSchemaDefault);
            this.editedPhoneIndex = -1;
          }, 300);
          break;
  
        case 'phoneOrg':
          this.phoneOrgDialog = false;
          setTimeout(() => {
            this.phoneSchema = Object.assign({}, this.phoneSchemaDefault);
            this.editedPhoneOrgIndex = -1;
          }, 300);
          break;

        case 'address':
          this.addressDialog = false;
          setTimeout(() => {
            this.addressSchema = Object.assign({}, this.addressSchemaDefault);
            this.editedAddressIndex = -1;
          }, 300);
          break;

        case 'addressOrg':
          this.addressOrgDialog = false;
          setTimeout(() => {
            this.addressSchema = Object.assign({}, this.addressSchemaDefault);
            this.editedAddressOrgIndex = -1;
          }, 300);
          break;

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
  
        default:
          break;
      }
    },

    // eslint-disable-next-line complexity
    save (item) {
      console.log(item, this.organizationSchema, this.$refs[item].validate());
      if (this.$refs[item].validate() === true) {
        switch (item) {
          case 'organization':
            this.organizationDialog = false;
            if (this.editedOrganizationIndex > -1) {
              // Object.assign(this.organizations[this.editedOrganizationIndex], this.organizationSchema);
              this.updateRecord('Organization', this.organizationSchema);
            } else {
              this.createOrganization();
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
            break;
          
          case 'emailOrg':

            if (this.emailSchema.isDefault === true) {
              this.organizationSchema.emailDefault = this.emailSchema.email;
              this.organizationSchema.email.forEach((item, index) => {
                if (item.email !== this.emailSchema.email) this.organizationSchema.email[index].isDefault = false;
              });
            }
  
            if (this.editedEmailOrgIndex > -1) {
              Object.assign(this.organizationSchema.email[this.editedEmailOrgIndex], this.emailSchema);
            } else {
              this.organizationSchema.email.push(this.emailSchema);
            }
            // this.organizationSchema.email = this.organizationSchema.email;
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
            break;
          
          case 'phoneOrg':
            
            if (this.phoneSchema.isDefault === true) {
              this.organizationSchema.phoneDefault = this.phoneSchema.number;
              this.organizationSchema.phone.forEach((item, index) => {
                if (item.number !== this.phoneSchema.number) this.organizationSchema.phone[index].isDefault = false;
              });
            }
  
            if (this.editedPhoneOrgIndex > -1) {
              Object.assign(this.organizationSchema.phone[this.editedPhoneOrgIndex], this.phoneSchema);
            } else {
              this.organizationSchema.phone.push(this.phoneSchema);
            }
            // this.organizationSchema.phone = this.organizationSchema.phone;
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
            break;
  
          case 'addressOrg':
  
            if (this.addressSchema.isDefault === true) {
              this.organizationSchema.address.forEach((item, index) => {
                if (item.line_1 !== this.addressSchema.line_1) this.organizationSchema.address[index].isDefault = false;
              });
            }
  
            if (this.editedAddressOrgIndex > -1) {
              Object.assign(this.organizationSchema.address[this.editedAddressOrgIndex], this.addressSchema);
            } else {
              this.organizationSchema.address.push(this.addressSchema);
            }
            // this.organizationSchema.address = this.organizationSchema.address;
            break;

          case 'users':
            this.human.user = this.user;
            this.human.email = this.emails;
            this.human.phone = this.phones;
            this.human.address = this.addresss;
            this.human.relation = this.organizationHumanRelationSchema;
            // this.human.relation.startDate = new Date(this.human.relation.startDate).toISOString();

            if (this.editedusersIndex > -1) {
              Object.assign(this.members[this.editedusersIndex], this.human);
            } else {
              this.members.push(this.human);
            }
            break;
  
        
          default:
            break;
        }
        console.log('this.members >>>>>>', this.members);
        this.$forceUpdate();
        this.close(item);

      } else {
        Swal.fire(
          'Attention!',
          'All required fields must be completed.',
          'warning'
        );
        this.$vuetify.goTo('#outsideOrganizationTop');
        
      }
    },
    async createOrganization () {
      const ObjectID = require('bson-objectid');
      // this.organizationSchema._id = (ObjectID()).toString();
      // this.organizationSchema.id = '123456'

      console.log('Organization Create payload >>>>>>>>> ', this.organizationSchema);
      let { error, data } = await create('Organization', this.organizationSchema);
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
        // store.commit('setSetup', data);
        this.organizations.push(data);
        console.log('Organization created successfully', data);
        if (this.members.length > 0) await this.createHuman(data, this.members);
        // this.bus.$emit('nextStep', 3);
      }
    },
    async updateRecord (item, payload) {
      console.log(item, 'update payload >>>>>>>>> ', payload);
      let { error, data } = await update(item, payload, payload.id);
      if (error)
      {
        console.error('error on load', error);
        return { data, error };
      } 
      else
      {
        console.log(item, 'updated successfully', data);
        this.feedSelects(item);
      }
    }, /* 
    async updateOrganization () {
      console.log('Organization Update PAYLOAD >>>>>>>>> ', this.organizationSchema);
      let { error, data } = await update('Organization', this.organizationSchema, this.organizationSchema._id);
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
        // store.commit('setSetup', data);
        console.log('Organization updated successfully', data);
        this.feedSelects('Organization');
        // this.bus.$emit('nextStep', 3);
      }
    }, */
    async createHuman (organization, members) {
      members.forEach(async (human, index) => {
        let payloadUser = human.user;
        if (human.birthDate === '') delete human.birthDate;
        delete human.user;
        // let humanRelationSchema = Object.assign({}, human.relation);
        console.log('createHuman() >> payload >>>>>>>>> ', members.length === (index + 1), human, human.relation.startDate);

        let { error, data } = await create('Human', human);
        if (error)
        {
          console.error('error on load', error);
          return { data, error };
        } 
        else
        {
          let memberRelation = human.relation;
          memberRelation.human = data._id;
          // memberRelation.startDate = moment(memberRelation.startDate, true).format();
          memberRelation.startDate = new Date(human.relation.startDate).toISOString();
          organization.human.push(memberRelation);
          payloadUser.human = data._id;
          await this.createUser(payloadUser, data);
          
          if (members.length === (index + 1)) this.updateRecord('Organization', organization);
        }
      });
      // console.log('createHuman() >> Update Organization >>>>>>>>>>', organization);
      
    },
    async createUser (payload, human) {
      payload.roles = payload.roles.split(); 
      // console.log('User create payload >>>>>>>>> ', payload);
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
        await this.updateRecord('Human', human)
      }
    },
    async delete (entity, id) {
      console.log('Delete >>>>>>>>> ', entity, id);
      let { error, data } = await remove(entity, id);
      if (error)
      {
        console.error('error on load', error);
        return { data, error };
      } 
      else
      {
        console.log(entity, 'Deleted successfully', data);
        this.feedSelects('Organization');
      }
    },
    async getHuman (entity, where) {
      let populate = entity === 'Human' ? 'user' : '';
      where = where.length > 0 ? { $and: where } : false;
      console.log('getHuman >>>>>>>>> ', entity, where);
      let { error, data } = await getFromApi(entity, this, where, populate);
      if (error)
      {
        console.error('error on load', error);
        return { data, error };
      } 
      else
      {
        console.log(entity, 'getHuman successfully', data);
        this.members = data;
        // this.feedSelects('Organization');
      }
    },
    async feedSelects (entity) {
      let populate = entity === 'Human' ? 'user' : '';
      let where = entity === 'Role' ? { type: 'Service' } : false;
      
      let { data, total, error } = await getFromApi(entity, this, where, populate);
      if (error) {
        console.log(error);
      } else {
        console.log('feedSelects', entity, data);
        switch (entity) {
          case 'Service':
            this.servicesItem = data;
            break;
          case 'Human':
            this.members = data;
            break;
          case 'Organization':
            this.organizations = data;
            break;
          case 'Role':
            this.roleItems = data;
            
            break;
          default:
            break;
        }
      }
      this.$forceUpdate();
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

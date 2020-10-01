/* global session moment */
import { update, create, getLocalCollection } from '../../helpers/helpers';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'ClientsAdd',
  data: () => ({
    valid: true,
    payload: [],
    humans: [],
    humansUpdate: [],
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    snackbar: {
      show: false,
      color: '',
      text: ''
    },
    first_name: [],
    last_name: [],
    nationality: [],
    organization: [],
    ssn: [],
    contactType: null,
    personType: null,
    personQnt: 1,
    person: 0,
    organizationType: null,
    organizationTypeItems: [
      'Agency',
      'Hospital',
      'Insurance Company',
      'Law Firm',
      'Orphanage',
      'Outreach Organization'
    ],
    genderType: [],
    genderTypeItems: [
      'Male',
      'Female',
      'Female to Male',
      'Male to Female',
      'In Transition',
      'Other',
      'Unknown'
    ],
    sexualPrefType: [],
    sexualPrefTypeItems: [
      'Heterosexual/Straight',
      'Gay/Lesbian',
      'Other',
      'Prefer Not to Answer',
      'Unknown'
    ],
    phoneType: [],
    phone: [],
    phones: [],
    phoneCC: [],
    phoneA: [],
    email: [],
    emails: [],
    emailType: {
      item: []
    },
    phoneMailTypeItems: [
      'Home',
      'Work',
      'Vacation'
    ],
    phoneQnt: [1],
    address: [],
    emailQnt: [1],
    selectCase: null,
    step: 1,
    programSelected: [],
    humanItems: [],
    humanSelected: [],
    showRelationship: [],
    humanRelationship: [],
    relationshipItems: [],
    relationshipSelected: [],
    relationshipStartDate: [],
    relationshipEndDate: [],
    relationshipMemo: [],
    menuStartDateRelationship: [],
    menuEndDateRelationship: [],
    showOrganization: [],
    humanOrganization: [],
    organizationSelected: [],
    organizationItems: [],
    organizationStartDate: [],
    organizationEndDate: [],
    organizationMemo: [],
    menuStartDateOrganization: [],
    menuEndDateOrganization: [],
    organizationSelected_: null,
    organizationItems_: null,
    organizationStartDate_: null,
    organizationEndDate_: null,
    organizationMemo_: null,
    menuStartDateOrganization_: null,
    menuEndDateOrganization_: null,
    organizationHuman_: null,
    organizationRoleSelected_: null,
    organizationRoleItems_: null,
    showGroup: [],
    showPeople: false,
    humanGroup: [],
    groupItems: [],
    groupSelected: [],
    groupRoleItems: [],
    groupRoleSelected: [],
    groupStartDate: [],
    groupEndDate: [],
    groupMemo: [],
    menuStartDateGroup: [],
    menuEndDateGroup: [],
    programsItems: [],
    programsSelected: [],
    programsRoleItems: [],
    programsRoleSelected: [],
    programsStartDate: [],
    programsEndDate: [],
    programsMemo: [],
    showPrograms: [],
    menuStartDatePrograms: [],
    menuEndDatePrograms: [],
    humanPrograms: [],
    roleItems: [],
    roleSelected: [],
    caseItems: [],
    caseSelected: [],
    caseStartDate: [],
    caseEndDate: [],
    caseStartDateNew: null,
    caseEndDateNew: null,
    display_name: null,
    case_number: null,
    caseType: null,
    caseTypeItems: [],
    caseStatus: null,
    caseStatusItems: [],
    caseNotesItems: [],
    caseNotesSelected: [],
    is_placement: false,
    menuStartDate: [],
    menuEndDate: [],
    menuStartDateNewCase: false,
    menuEndDateNewCase: false,
    userItems: [],
    userSelected: [],
    userSelect: null,
    addUserDialog: false,
    form: [],
    birthDate: [],
    menuBirthday: [],
    deathDate: [],
    menuDeathday: [],
    age: [],
    menu: false,
    portal: [],
    active: [null, true],
    addUser: {
      username: '',
      password: '',
      roles: [],
      human: '',
      portal_access: false,
      changePasswordNextLogin: false,
      social: {},
      active: true,
      timezone: 'America/New_York',
      currency_code: 'USD',
      currency_symbol: '$',
      currency_decimal: ',',
      currency_thousands: '.',
      language: 'en',
      portal_color: 'blue',
      portal_isDark: false
    },
    defaultAddUser: {
      username: '',
      password: '',
      roles: [],
      human: '',
      portal_access: false,
      changePasswordNextLogin: false,
      social: {},
      active: true,
      timezone: 'America/New_York',
      currency_code: 'USD',
      currency_symbol: '$',
      currency_decimal: ',',
      currency_thousands: '.',
      language: 'en',
      portal_color: 'blue',
      portal_isDark: false
    },
    addOrganization: {
      name: '',
      type: '',
      feid_number: null,
      referral_source: '',
      license_number: '',
      license_expire_date: null,
      services: [],
      human: [],
      email: [],
      address: [],
      phone: [],
      file: [],
    },
    defaultOrganization: {
      name: '',
      type: '',
      feid_number: null,
      referral_source: '',
      license_number: '',
      license_expire_date: null,
      services: [],
      human: [],
      email: [],
      address: [],
      phone: [],
      file: [],
    },
    organizationServicesItems: [],
    organizationHuman: null,
    organizationRoleSelected: [],
    organizationRoleItems: [],
    organizationFile: [],
    fileQnt: [1],
    files: [],
    boss_level: null,
    showAddress: false,
    organizationAddress: {
      type: '',
      line_1: '',
      line_2: '',
      city: '',
      state: '',
      country: '',
      zip: ''
    },
    nextContact: null,
    userRoleItems: ['admin', 'staff', 'parent', 'child', 'agency', 'caseworker', 'manager'],
    timezoneItems: ['Africa/Abidjan', 'Africa/Accra', 'Africa/Algiers', 'Africa/Bissau', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Ceuta', 'Africa/El_Aaiun', 'Africa/Johannesburg', 'Africa/Juba', 'Africa/Khartoum', 'Africa/Lagos', 'Africa/Maputo', 'Africa/Monrovia', 'Africa/Nairobi', 'Africa/Ndjamena', 'Africa/Sao_Tome', 'Africa/Tripoli', 'Africa/Tunis', 'Africa/Windhoek', 'America/Adak', 'America/Anchorage', 'America/Araguaina', 'America/Argentina/Buenos_Aires', 'America/Argentina/Catamarca', 'America/Argentina/Cordoba', 'America/Argentina/Jujuy', 'America/Argentina/La_Rioja', 'America/Argentina/Mendoza', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Salta', 'America/Argentina/San_Juan', 'America/Argentina/San_Luis', 'America/Argentina/Tucuman', 'America/Argentina/Ushuaia', 'America/Asuncion', 'America/Atikokan', 'America/Bahia', 'America/Bahia_Banderas', 'America/Barbados', 'America/Belem', 'America/Belize', 'America/Blanc-Sablon', 'America/Boa_Vista', 'America/Bogota', 'America/Boise', 'America/Cambridge_Bay', 'America/Campo_Grande', 'America/Cancun', 'America/Caracas', 'America/Cayenne', 'America/Chicago', 'America/Chihuahua', 'America/Costa_Rica', 'America/Creston', 'America/Cuiaba', 'America/Curacao', 'America/Danmarkshavn', 'America/Dawson', 'America/Dawson_Creek', 'America/Denver', 'America/Detroit', 'America/Edmonton', 'America/Eirunepe', 'America/El_Salvador', 'America/Fort_Nelson', 'America/Fortaleza', 'America/Glace_Bay', 'America/Godthab', 'America/Goose_Bay', 'America/Grand_Turk', 'America/Guatemala', 'America/Guayaquil', 'America/Guyana', 'America/Halifax', 'America/Havana', 'America/Hermosillo', 'America/Indiana/Indianapolis', 'America/Indiana/Knox', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Tell_City', 'America/Indiana/Vevay', 'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Inuvik', 'America/Iqaluit', 'America/Jamaica', 'America/Juneau', 'America/Kentucky/Louisville', 'America/Kentucky/Monticello', 'America/La_Paz', 'America/Lima', 'America/Los_Angeles', 'America/Maceio', 'America/Managua', 'America/Manaus', 'America/Martinique', 'America/Matamoros', 'America/Mazatlan', 'America/Menominee', 'America/Merida', 'America/Metlakatla', 'America/Mexico_City', 'America/Miquelon', 'America/Moncton', 'America/Monterrey', 'America/Montevideo', 'America/Nassau', 'America/New_York', 'America/Nipigon', 'America/Nome', 'America/Noronha', 'America/North_Dakota/Beulah', 'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/Ojinaga', 'America/Panama', 'America/Pangnirtung', 'America/Paramaribo', 'America/Phoenix', 'America/Port-au-Prince', 'America/Port_of_Spain', 'America/Porto_Velho', 'America/Puerto_Rico', 'America/Punta_Arenas', 'America/Rainy_River', 'America/Rankin_Inlet', 'America/Recife', 'America/Regina', 'America/Resolute', 'America/Rio_Branco', 'America/Santarem', 'America/Santiago', 'America/Santo_Domingo', 'America/Sao_Paulo', 'America/Scoresbysund', 'America/Sitka', 'America/St_Johns', 'America/Swift_Current', 'America/Tegucigalpa', 'America/Thule', 'America/Thunder_Bay', 'America/Tijuana', 'America/Toronto', 'America/Vancouver', 'America/Whitehorse', 'America/Winnipeg', 'America/Yakutat', 'America/Yellowknife', 'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/DumontDUrville', 'Antarctica/Macquarie', 'Antarctica/Mawson', 'Antarctica/Palmer', 'Antarctica/Rothera', 'Antarctica/Syowa', 'Antarctica/Troll', 'Antarctica/Vostok', 'Asia/Almaty', 'Asia/Amman', 'Asia/Anadyr', 'Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Ashgabat', 'Asia/Atyrau', 'Asia/Baghdad', 'Asia/Baku', 'Asia/Bangkok', 'Asia/Barnaul', 'Asia/Beirut', 'Asia/Bishkek', 'Asia/Brunei', 'Asia/Chita', 'Asia/Choibalsan', 'Asia/Colombo', 'Asia/Damascus', 'Asia/Dhaka', 'Asia/Dili', 'Asia/Dubai', 'Asia/Dushanbe', 'Asia/Famagusta', 'Asia/Gaza', 'Asia/Hebron', 'Asia/Ho_Chi_Minh', 'Asia/Hong_Kong', 'Asia/Hovd', 'Asia/Irkutsk', 'Asia/Jakarta', 'Asia/Jayapura', 'Asia/Jerusalem', 'Asia/Kabul', 'Asia/Kamchatka', 'Asia/Karachi', 'Asia/Kathmandu', 'Asia/Khandyga', 'Asia/Kolkata', 'Asia/Krasnoyarsk', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Asia/Macau', 'Asia/Magadan', 'Asia/Makassar', 'Asia/Manila', 'Asia/Nicosia', 'Asia/Novokuznetsk', 'Asia/Novosibirsk', 'Asia/Omsk', 'Asia/Oral', 'Asia/Pontianak', 'Asia/Pyongyang', 'Asia/Qatar', 'Asia/Qostanay', 'Asia/Qyzylorda', 'Asia/Riyadh', 'Asia/Sakhalin', 'Asia/Samarkand', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Srednekolymsk', 'Asia/Taipei', 'Asia/Tashkent', 'Asia/Tbilisi', 'Asia/Tehran', 'Asia/Thimphu', 'Asia/Tokyo', 'Asia/Tomsk', 'Asia/Ulaanbaatar', 'Asia/Urumqi', 'Asia/Ust-Nera', 'Asia/Vladivostok', 'Asia/Yakutsk', 'Asia/Yangon', 'Asia/Yekaterinburg', 'Asia/Yerevan', 'Atlantic/Azores', 'Atlantic/Bermuda', 'Atlantic/Canary', 'Atlantic/Cape_Verde', 'Atlantic/Faroe', 'Atlantic/Madeira', 'Atlantic/Reykjavik', 'Atlantic/South_Georgia', 'Atlantic/Stanley', 'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Broken_Hill', 'Australia/Currie', 'Australia/Darwin', 'Australia/Eucla', 'Australia/Hobart', 'Australia/Lindeman', 'Australia/Lord_Howe', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Sydney', 'CET', 'CST6CDT', 'EET', 'EST', 'EST5EDT', 'Etc/GMT', 'Etc/GMT+1', 'Etc/GMT+10', 'Etc/GMT+11', 'Etc/GMT+12', 'Etc/GMT+2', 'Etc/GMT+3', 'Etc/GMT+4', 'Etc/GMT+5', 'Etc/GMT+6', 'Etc/GMT+7', 'Etc/GMT+8', 'Etc/GMT+9', 'Etc/GMT-1', 'Etc/GMT-10', 'Etc/GMT-11', 'Etc/GMT-12', 'Etc/GMT-13', 'Etc/GMT-14', 'Etc/GMT-2', 'Etc/GMT-3', 'Etc/GMT-4', 'Etc/GMT-5', 'Etc/GMT-6', 'Etc/GMT-7', 'Etc/GMT-8', 'Etc/GMT-9', 'Etc/UTC', 'Europe/Amsterdam', 'Europe/Andorra', 'Europe/Astrakhan', 'Europe/Athens', 'Europe/Belgrade', 'Europe/Berlin', 'Europe/Brussels', 'Europe/Bucharest', 'Europe/Budapest', 'Europe/Chisinau', 'Europe/Copenhagen', 'Europe/Dublin', 'Europe/Gibraltar', 'Europe/Helsinki', 'Europe/Istanbul', 'Europe/Kaliningrad', 'Europe/Kiev', 'Europe/Kirov', 'Europe/Lisbon', 'Europe/London', 'Europe/Luxembourg', 'Europe/Madrid', 'Europe/Malta', 'Europe/Minsk', 'Europe/Monaco', 'Europe/Moscow', 'Europe/Oslo', 'Europe/Paris', 'Europe/Prague', 'Europe/Riga', 'Europe/Rome', 'Europe/Samara', 'Europe/Saratov', 'Europe/Simferopol', 'Europe/Sofia', 'Europe/Stockholm', 'Europe/Tallinn', 'Europe/Tirane', 'Europe/Ulyanovsk', 'Europe/Uzhgorod', 'Europe/Vienna', 'Europe/Vilnius', 'Europe/Volgograd', 'Europe/Warsaw', 'Europe/Zaporozhye', 'Europe/Zurich', 'HST', 'Indian/Chagos', 'Indian/Christmas', 'Indian/Cocos', 'Indian/Kerguelen', 'Indian/Mahe', 'Indian/Maldives', 'Indian/Mauritius', 'Indian/Reunion', 'MET', 'MST', 'MST7MDT', 'PST8PDT', 'Pacific/Apia', 'Pacific/Auckland', 'Pacific/Bougainville', 'Pacific/Chatham', 'Pacific/Chuuk', 'Pacific/Easter', 'Pacific/Efate', 'Pacific/Enderbury', 'Pacific/Fakaofo', 'Pacific/Fiji', 'Pacific/Funafuti', 'Pacific/Galapagos', 'Pacific/Gambier', 'Pacific/Guadalcanal', 'Pacific/Guam', 'Pacific/Honolulu', 'Pacific/Kiritimati', 'Pacific/Kosrae', 'Pacific/Kwajalein', 'Pacific/Majuro', 'Pacific/Marquesas', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Norfolk', 'Pacific/Noumea', 'Pacific/Pago_Pago', 'Pacific/Palau', 'Pacific/Pitcairn', 'Pacific/Pohnpei', 'Pacific/Port_Moresby', 'Pacific/Rarotonga', 'Pacific/Tahiti', 'Pacific/Tarawa', 'Pacific/Tongatapu', 'Pacific/Wake', 'Pacific/Wallis', 'WET'],
    currencycodeItems: ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BOV', 'BRL', 'BSD', 'BTN', 'BWP', 'BYR', 'BZD', 'CAD', 'CDF', 'CHE', 'CHF', 'CHW', 'CLF', 'CLP', 'CNY', 'COP', 'COU', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MXV', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 'STD', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'USN', 'USS', 'UYI', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XAG', 'XAU', 'XBA', 'XBB', 'XBC', 'XBD', 'XCD', 'XDR', 'XFU', 'XOF', 'XPD', 'XPF', 'XPT', 'XTS', 'XXX', 'YER', 'ZAR', 'ZMW'],
    currencydecimalItems: ['.', ','],
    languageItems: ['en', 'es'],
    portalColorItems: ['blue', 'teal', 'red', 'orange', 'purple', 'indigo', 'cyan', 'pink', 'green'],
    passwordShow: false,
    wallet: [],
    rules: {
      required: value => !!value || 'Required.',
      counter: value => value.length <= 20 || 'Max 20 characters',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      }
    }
  }),
  watch: {
    step (val) {
      if (this.step > val) {
        this.step = val;
      }
      if (this.step >= 4) {
        this.person = val - 4;
      }
      if (this.person === 0) {
        //
      }
      // console.log('step: ', val, this.person, this.emailQnt[this.person], this.emailQnt);
    },
    personQnt (val) {
      for (let index = 0; index < val; index++) {
        this.emailQnt[index] = 1;
        this.phoneQnt[index] = 1;
      }
      
      // console.log('personQnt: ', val, this.emailQnt);
    },
    birthDate (val) {
      this.age[this.person + 1] = moment().diff(val[this.person + 1], 'years') + ' years old';
      // console.log('datePickerBirthday: ', this.person, this.age[this.person], val);
    },
    selectCase (val) {
      // console.log('selectCase: ', val);
      if (val === 'AddCase') {
        this.feedSelects('Case');
        this.programSelected = [];
        this.roleSelected = [];
        // console.log(val);
      }
      else
      {
        this.caseSelected = [];
        this.feedSelects('CaseStatus');
        this.feedSelects('CaseNote');
        this.feedSelects('Program');
        this.valid = false;
      }
    }
  },
  mounted () {
    // console.log('mounted: ', this.$refs);
  },
  created () {
    this.feedSelects('CaseHumanRole');
    this.feedSelects('User');
    this.feedSelects('Human');
    this.feedSelects('HumanRelationship');
    this.feedSelects('Group');
    this.feedSelects('GroupRole');
    this.feedSelects('OrganizationService');
    this.feedSelects('OrganizationRole');
    this.feedSelects('Organization');
    this.feedSelects('Program');
    this.feedSelects('ProgramHumanRole');
    this.feedSelects('CaseType');
    this.feedSelects('Case');
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
  methods: {
    async feedSelects (entity) {
      let { data, total, error } = await getLocalCollection(entity);
      if (error) {
        console.log(error);
      } else {
        switch (entity) {
          case 'CaseHumanRole':
            this.roleItems = data;
            break;
          case 'Program':
            this.programsItems = data;
            break;
          case 'ProgramHumanRole':
            this.programsRoleItems = data;
            break;
          case 'Case':
            this.caseItems = data;
            break;
          case 'User':
            if (data) {
              this.userItems = data;
            }
            break;
          case 'CaseStatus':
            this.caseStatusItems = data;
            break;
          case 'CaseNote':
            this.caseNotesItems = data;
            break;
          case 'Human':
            this.humanItems = data;
            break;
          case 'HumanRelationship':
            this.relationshipItems = data;
            break;
          case 'Group':
            this.groupItems = data;
            break;
          case 'GroupRole':
            this.groupRoleItems = data;
            break;
          case 'OrganizationService':
            this.organizationServicesItems = data;
            break;
          case 'OrganizationRole':
            this.organizationRoleItems = data;
            break;
          case 'Organization':
            this.organizationItems = data;
            break;
          case 'CaseType':
            this.caseTypeItems = data;
            break;
          default:
            break;
        }
        console.log('feedSelects: ', entity, data);
      }
    },
    decrement () {
      this.personQnt--;
    },
    increment () {
      this.personQnt++;
    },
    saveBirth (date) {
      this.$refs.menuBirth[this.person].save(date);
      // this.person = n;
    },
    saveDeath (date) {
      console.log('save saveDeath', date);
      this.$refs.menuDeath[this.person].save(date);
      // this.person = n;
    },
    test () {
      console.log('Test() ', this.person, this.selectCase, this.$refs.form[this.person].validate());
      
    },

    setYear (e, p) {
      let item = e - 1;

      setTimeout(() => {
        if (p === 'b') {
          this.$refs.pickerB[this.person].activePicker = 'YEAR';
        }
        else
        {
          this.$refs.pickerD[this.person].activePicker = 'YEAR';
        }

      }, 300);
  
    },
    delEmail (n) {
      if (n) {
        this.emailQnt[n - 1]--;
      }
      else
      {
        this.emailQnt--;
      }
      console.log('delEmail', this.emailQnt[n - 1]);
      this.$forceUpdate();
    },
    addEmail (n, e) {
      if (n) {
        this.emailQnt[n - 1]++;
      }
      else
      {
        this.emailQnt++;
      }
      this.$forceUpdate();
      console.log('addEmail', this.emailQnt[n - 1]);
    },
    delFile () {
      this.fileQnt--;
      this.$forceUpdate();
    },
    addFile () {
      this.fileQnt++;
      this.$forceUpdate();
    },
    delPhone (n) {
      if (n) {
        this.phoneQnt[n - 1]--;
      }
      else
      {
        this.phoneQnt--;
      }
      // this.phoneQnt[n - 1]--;
      this.$forceUpdate();
    },
    addPhone (n) {
      if (n) {
        this.phoneQnt[n - 1]++;
      }
      else
      {
        this.phoneQnt++;
      }
      this.$forceUpdate();
    },
    async createNewUser (addPerson) {
      // console.log('createNewUser:', this.addUser);
      let { data, error } = await create('User', this.addUser);
      if (error)
      {
        console.error('error on update', error);
        this.snackbar = {
          show: true,
          color: 'red',
          text: error
        };
        return { data, error };
      } 
      else
      {
        this.addUserDialog = false;
        this.userItems.push(data);
        // this.feedSelects('User');
        console.log('NewUser:', data, this.userItems);
        
        setTimeout(() => {
          this.addUser = Object.assign({}, this.defaultAddUser);
          if (addPerson) {
            this.contactType = 'Person';
            this.step = 4;
          } 
          else
          {
            this.$router.push('client');
          }

          this.userSelected[this.person + 1] = data.id;
          // console.log('this.userItems: ', this.userItems);
        }, 300);

        
      }
    },
    async createNewOrganization () {
      if (this.$refs.organization.validate()) {
        this.addOrganization.human = [];
        this.addOrganization.phone = [];
        
        if (this.showAddress) {
          this.addOrganization.address.push(this.organizationAddress);
        }

        if (this.showPeople) {
          this.addOrganization.human.push(
            {
              'human': this.organizationHuman_,
              'role': this.organizationRoleSelected_,
              'boss_level': this.boss_level ? Number(this.boss_level) : 0,
              'startDate': this.organizationStartDate_ ? new Date(this.organizationStartDate_).toISOString() : this.organizationStartDate_,
              'endDate': this.organizationEndDate_ ? new Date(this.organizationEndDate_).toISOString() : this.organizationEndDate
            }
          );
          

          this.addOrganization.human.filter(column => {
            if (column.endDate === null) {
              delete column.endDate;
            }
            return column.endDate === null;
          });
        }

  
        for (let i = 0; i < this.phoneQnt; i++) {
          if (this.phone[i + 1]) {
            this.addOrganization.phone.push(
              {
                'type': this.phoneType[i + 1],
                'country_code': this.phoneCC[i + 1],
                'area_number': this.phoneA[i + 1],
                'number': this.phone[i + 1]
              }
            );
          }
        }

        for (let i = 0; i < this.emailQnt; i++) {
          if (this.emailType[i + 1]) {
            this.addOrganization.email.push(
              {
                'type': this.emailType[i + 1],
                'email': this.email[i + 1]
              }
            );
          }
        }
        // console.log('createNewOrganization:', this.addOrganization);

        for (const key in this.addOrganization) {
          if (this.addOrganization.hasOwnProperty(key)) {
            const element = this.addOrganization[key];
            if (!element || element.length === 0 || element === '') {
              // console.log('array', key, element);
              delete this.addOrganization[key];
            }
          }
        }
        // console.log('createNewOrganization:', this.addOrganization);
        let { data, error } = await create('Organization', this.addOrganization);
        if (error)
        {
          console.error('error on update', error);
          this.snackbar = {
            show: true,
            color: 'red',
            text: error
          };
          return { data, error };
        } 
        else
        {
          console.log('Neworganization:', data, this.organozationItems);
          
          setTimeout(() => {
            this.addOrganization = Object.assign({}, this.defaultAddOrganization);
            this.$router.push('organization');
  
          }, 300);
  
        }
      }
      
    },
    closeNewUser () {
      this.addUserDialog = false;
      setTimeout(() => {

        this.addUser = Object.assign({}, this.defaultAddUser);

        if (this.contactType === 'User') {
          this.$router.push('client');
        }

      }, 300);
      
    },
    // eslint-disable-next-line complexity
    async create (a, n) {
      this.payload = [];
      this.humans = [];
      this.humansUpdate = [];
      
      if (this.$refs.form[this.person].validate()) {
        for (let person = 0; person < this.personQnt; person++) {
          this.emails = [];
          this.phones = [];
          this.address = [];
          let item = person + 1;

          this.humanGroup = [];
          this.humanRelationship = [];
          this.humanOrganization = [];
          this.humanPrograms = [];

          if (this.humanSelected[person + 1]) {
            this.humanRelationship.push(
              {
                'human': this.humanSelected[person + 1],
                'relationship_type': this.relationshipSelected[person + 1],
                'startDate': this.relationshipStartDate[person + 1] ? new Date(this.relationshipStartDate[person + 1]).toISOString() : this.relationshipStartDate[person + 1],
                'endDate': this.relationshipEndDate[person + 1] ? new Date(this.relationshipEndDate[person + 1]).toISOString() : this.relationshipEndDate[person + 1],
                'memo': this.relationshipMemo[person + 1]
              }
            );
          }

          if (this.showOrganization[person + 1]) {
            this.humanOrganization.push(
              {
                'organization': this.organizationSelected[person + 1],
                'role': this.organizationRoleSelected[person + 1],
                'boss_level': this.boss_level ? Number(this.boss_level) : 0,
                'startDate': this.organizationStartDate[person + 1] ? new Date(this.organizationStartDate[person + 1]).toISOString() : this.organizationStartDate[person + 1],
                'endDate': this.organizationEndDate[person + 1] ? new Date(this.organizationEndDate[person + 1]).toISOString() : this.organizationEndDate[person + 1]
              }
            );
          }
          

          if (this.showGroup[person + 1]) {
            this.humanGroup.push(
              {
                'group': this.groupSelected[person + 1],
                'role': this.groupRoleSelected[person + 1],
                'startDate': this.groupStartDate[person + 1] ? new Date(this.groupStartDate[person + 1]).toISOString() : this.groupStartDate[person + 1],
                'endDate': this.groupEndDate[person + 1] ? new Date(this.groupEndDate[person + 1]).toISOString() : this.groupEndDate[person + 1]
              }
            );
          }
          console.log('this.showprograms', this.showPrograms);
          if (this.showPrograms[person + 1]) {
            this.humanPrograms.push(
              {
                'program': this.programsSelected[person + 1],
                'startDate': this.programsStartDate[person + 1] ? new Date(this.programsStartDate[person + 1]).toISOString() : this.programsStartDate[person + 1],
                'role': this.programsRoleSelected[person + 1],
                'endDate': this.programsEndDate[person + 1] ? new Date(this.programsEndDate[person + 1]).toISOString() : this.programsEndDate[person + 1]
              }
            );
          }

          if (this.showAddress) {
            this.address.push(this.organizationAddress);
          }

          /* if (this.adressLine_1[person + 1]) {
            this.adress.push(
              {
                'type': '',
                'line_1': '',
                'line_2': '',
                'city': '',
                'state': '',
                'country': '',
                'zip': ''
              }
            );
          } */

          for (let i = 0; i < this.phoneQnt[person]; i++) {
            let phone = String(person + 1) + (i + 1);

            if (this.phoneCC[phone]) {
              this.phones.push(
                {
                  'type': this.phoneType[phone],
                  'country_code': this.phoneCC[phone],
                  'area_number': this.phoneA[phone],
                  'number': this.phone[phone]
                }
              );
            }
          }

          for (let i = 0; i < this.emailQnt[person]; i++) {
            let email = String(person + 1) + (i + 1);
            this.emails.push(
              {
                'type': this.emailType[email],
                'email': this.email[email]
              }
            );
          }
          console.log('this.organizationFile', this.organizationFile);
          for (let i = 0; i < this.fileQnt; i++) {
            this.files.push(
              {
                'name': this.organizationFile[person + 1]
              }
            );
          }

          // console.log('create: ', n, this.personQnt, person, this.step, this.payload, this.organization[person + 1]);

          this.payload.push(
            {
              'user': this.userSelected[person + 1],
              'first_name': this.first_name[person + 1],
              'last_name': this.last_name[person + 1],
              'nationality': this.nationality[person + 1],
              'gender': this.genderType[person + 1],
              'sexual_orientation': this.sexualPrefType[person + 1],
              'birthDate': this.birthDate[person + 1],
              'deathDate': this.deathDate[person + 1],
              'photo': '',
              'ssn': this.ssn[person + 1],
              'active': this.active[person + 1],
              'organization': this.humanOrganization,
              'email': this.emails,
              'address': this.address,
              'phone': this.phones,
              'human_relationship': this.humanRelationship,
              'group': this.humanGroup,
              'case': [],
              'program': this.humanPrograms
              // 'file': this.files
            });

        }// for
        
        if (this.personQnt === n) {
          this.payload.forEach((element, i) => {
            console.log('PAYLOAD element:', i, element);
            this.humansUpdate.push(element);
            (async () => {
              let { data, error } = await create('Human', element);
              if (error)
              {
                console.error('error on update', error);
                return { data, error };
              }
              else
              {
                console.log('NewHuman:', data);
                let humanId = data.id;
                let humanName = data.first_name + ' ' + data.last_name;
                if (this.selectCase) {
                  this.humans.push(
                    {
                      'human': data.id,
                      'role': this.roleSelected[i + 1],
                      'startDate': new Date(this.caseStartDate[i + 1]).toISOString(),
                      'endDate': this.caseEndDate[i + 1] ? new Date(this.caseEndDate[i + 1]).toISOString() : this.caseEndDate[i + 1]
                    }
                  );

                  // Case
                  // eslint-disable-next-line no-eval
                  console.log('this.caseSelected+++++++++', this.caseSelected);
                  switch (this.selectCase) {
                    case 'CreateCase': {
                      let casePayload = {
                        'type': this.caseType,
                        'program': this.programSelected,
                        'status': this.caseStatus,
                        'human': this.humans,
                        'startDate': new Date(this.caseStartDateNew).toISOString(),
                        'endDate': new Date(this.caseEndDateNew).toISOString(),
                        // eslint-disable-next-line no-eval
                        'cases': this.caseSelected,
                        'is_placement': this.is_placement,
                        'case_number': this.case_number,
                        'display_name': this.display_name
                      };

                      if (this.caseEndDateNew === null) {
                        delete casePayload.endDate;
                      }

                      if (this.programSelected === null) {
                        delete casePayload.program;
                      }
                      console.log(this.selectCase, casePayload);

                      this.createCase(casePayload);
                    }
                      break;
            
                    case 'AddCase': {
                      console.log('this.humansUpdate', this.humansUpdate[i]);
                      this.humansUpdate[i].case.push(
                        {
                          'case': this.caseSelected,
                          'role': this.roleSelected[i + 1],
                          'startDate': new Date(this.caseStartDate[i + 1]).toISOString(),
                          'endDate': this.caseEndDate[i + 1] ? new Date(this.caseEndDate[i + 1]).toISOString() : this.caseEndDate[i + 1]
                        }
                      );

                      console.log(this.selectCase, this.caseSelected, this.humansUpdate[i]);
                      let { data, error } = await update('Human', this.humansUpdate[i], humanId);
                      if (error)
                      {
                        console.error('error on update Human', error);
                        return { data, error };
                      }
                      else
                      {
                        console.log('Human UPDATE:', data);
                        this.humanItems.push(data);
                                
                      }
                    }
                      break;
                    default:

                      break;
                  }// switch

                }

                if (this.wallet[n] === true) {
                  let walletPayload = {
                    'human': humanId,
                    'name': humanName + ' - Wallet',
                    'account_number': Math.floor(Math.random().toString(10).slice(-10)),
                  };
                  
                  let { data, error } = await create('Wallet', walletPayload);
                  if (error)
                  {
                    console.error('error on create wallet', error);
                    return { data, error };
                  }
                  else
                  {
                    console.log('wallet:', data);
                  }
                }

                if (this.personQnt === n) {
                  this.$router.push('client');
                }
                else {
                  this.step = this.step + 1;
                }
                // this.humanItems.push(data);
              }
            })();
          });
        }
      }
    },
    async createCase (payload) {

      let { data, error } = await create('Case', payload);
      if (error)
      {
        console.error('error on create case', error);
        return { data, error };
      }
      else
      {
        console.log('Case:', data);
                
      }

    }
  }
};
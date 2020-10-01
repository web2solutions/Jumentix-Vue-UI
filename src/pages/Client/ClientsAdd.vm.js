/* global session moment */
import { update, create, getLocalCollection, getFromApi } from '../../helpers/helpers';
import Country from '@/api/country';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Swal from 'sweetalert2/dist/sweetalert2.js';
export default {
  name: 'ClientsAdd',
  props: {
    bus: {
      type: Object,
      default: function () { return {} },
    }
  },
  components: {
    VuePerfectScrollbar
  },
  data: () => ({
    valid: true,
    payload: [],
    humans: [],
    humansUpdate: [],
    countrys: Country,
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
    nationality: ['United States of America', 'United States of America', 'United States of America', 'United States of America', 'United States of America', 'United States of America'],
    organization: [],
    ssn: [],
    contactType: 'Person',
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
    countryItems: ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua &amp; Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L`Este', 'Togo', 'Tonga', 'Trinidad &amp; Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'],
    genderType: ['Male', 'Male', 'Male', 'Male', 'Male', 'Male'],
    genderTypeItems: [
      'Male',
      'Female',
      'Female to Male',
      'Male to Female',
      'In Transition',
      'Other',
      'Unknown'
    ],
    sexualPrefType: ['Heterosexual/Straight', 'Heterosexual/Straight', 'Heterosexual/Straight', 'Heterosexual/Straight', 'Heterosexual/Straight', 'Heterosexual/Straight', 'Heterosexual/Straight'],
    sexualPrefTypeItems: [
      'Heterosexual/Straight',
      'Gay/Lesbian',
      'Other',
      'Prefer Not to Answer',
      'Unknown'
    ],
    phoneType: ['Home', 'Home', 'Home', 'Home'],
    phone: [],
    phones: [],
    phoneCC: ['+1', '+1'],
    phoneA: [],
    email: [],
    successEmail: [],
    successEmailMsg: [],
    errorEmail: [],
    errorEmailMsg: [],
    emails: [],
    emailType: ['Home', 'Home', 'Home', 'Home'],
    phoneMailTypeItems: [
      'Home',
      'Work',
      'Vacation'
    ],
    phoneQnt: [1],
    phoneQntOrg: 1,
    address: [],
    emailQnt: [1],
    emailQntOrg: 1,
    selectCase: 'AddContactOnly',
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
    caseStartDateNew: new Date().toISOString().substr(0, 10),
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
    userExistis: [],
    userSelect: null,
    addUserDialog: false,
    form: [],
    birthDate: [],
    birthDateFormatted: [],
    menuBirthday: [],
    birthError: false,
    birthErrorMsg: '',
    deathError: false,
    deathErrorMsg: '',
    deathDate: [],
    deathDateFormatted: [],
    menuDeathday: [],
    age: [],
    menu: false,
    portal: [true, true],
    active: [null, true],
    addUserUsername: [],
    addUserPassword: [],
    addUserRoles: [],
    addUser: {
      username: '',
      password: '',
      roles: '',
      human: '',
      portal_access: true,
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
      portal_access: true,
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
      email: [
        {
          email: '',
          type: 'Home'
        },
        {
          email: '',
          type: 'Home'
        }
      ],
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
      country: 'United States of America',
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
    SSNShow: false,
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
  computed: {
    computedStartDateNewCase (e) {
      return this.caseStartDateNew ? moment(this.caseStartDateNew).format('L') : '';
    },
    computedEndDateNewCase (e) {
      return this.caseEndDateNew ? moment(this.caseEndDateNew).format('L') : '';
    }
  },
  watch: {
    step (val) {
      if (this.step > val) {
        this.step = val;
      }
      if (this.step >= 2) {
        this.person = val - 2;
      }
      if (this.person === 0) {
        //
      }
      // console.log('step: ', val, this.person, this.emailQnt[this.person], this.emailQnt);
    },
    personQnt (val) {
      for (let index = 0; index < val; index++) {
        this.phoneCC[index + 1 + '1'] = '+1';
        this.emailQnt[index] = 1;
        this.phoneQnt[index] = 1;
        this.portal[index] = true; 
      }
      
      // console.log('personQnt: ', val, this.phoneCC);
    },
    birthDateFormatted (val) {
      let newDate = '';
      this.birthError = false;
      this.birthErrorMsg = '';
      if (val[this.person + 1].length >= 2 && val[this.person + 1].substr(0, 2) > 12) {
        this.birthError = true;
        this.birthErrorMsg = 'The date format must be mm/dd/yyyy';
      } else {
        if (val[this.person + 1].length === 8) {

          newDate = val[this.person + 1] ? val[this.person + 1].substr(0, 2) + '/' + val[this.person + 1].substr(2, 2) + '/' + val[this.person + 1].substr(4) : val[this.person + 1];
          this.age[this.person + 1] = moment().diff(new Date(newDate).toISOString().substr(0, 10), 'years') + ' years old';
          // console.log('ok', new Date(newDate).toISOString().substr(0, 10), this.age[this.person + 1]);
          this.$forceUpdate();
        }
      }
      this.$forceUpdate();
    },
    birthDate (val) {
      // console.log('datePickerBirthday: >>>>>>>>>', this.person, this.age[this.person + 1], val[this.person + 1]);
      this.age[this.person + 1] = moment().diff(val[this.person + 1], 'years') + ' years old';
      this.birthDateFormatted[this.person + 1] = moment(val[this.person + 1]).format('L');
      // console.log('datePickerBirthday: ', this.person, this.age[this.person + 1], val[this.person + 1]);
    },
    deathDate (val) {
      this.deathDateFormatted[this.person + 1] = moment(val[this.person + 1]).format('L');
      // console.log('datePickerdeathDate: ', this.person, this.age[this.person + 1], val);
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
    },
    contactType (val) {
      if (val !== 'Family') this.personQnt = 1;
      // console.log(val);
    }
  },
  mounted () {
    // console.log('mounted: ', this.$refs);
    this.bus.$on('createNew', val => {
      this.contactType = val;
      // this.step = 2;
      console.log(val);
    });
    this.$refs.phone[0].setValue('+1');
    this.emailType['11'] = 'Home';
    this.emailType['21'] = 'Home';
    this.phoneType['11'] = 'Home';
    this.phoneType['21'] = 'Home';
    // console.log('mounted: ', this.bus, this.$refs.phone);
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
    this.feedSelects('OrganizationType');
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
          case 'OrganizationType':
            this.organizationTypeItems = data;
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
        // console.log('feedSelects: ', entity, data);
      }
    },
    decrement () {
      this.personQnt--;
    },
    increment () {
      this.personQnt++;
    },
    test () {
      // console.log('Test() ', this.person, this.selectCase, this.$refs.form[this.person].validate(), this.$refs);

      if (this.$refs.form[this.person].validate()) {
        this.step = this.step + 1;
      } else {
        Swal.fire(
          'Attention!',
          'All required fields must be completed.',
          'warning'
        );
        this.$vuetify.goTo('#person_' + (this.person + 1));
      }
      
    },
    testCase () {
      switch (this.selectCase) {
        case 'CreateCase':
          if (this.$refs.case.validate()) {
            this.create();
          } else {
            Swal.fire(
              'Attention CASE!',
              'All required fields must be completed.',
              'warning'
            );
            this.$vuetify.goTo('#caseAdd');
          }
          break;
        default:
          this.create();
          break;
      }
      console.log('testCase >>>>>>>>>>>', this.selectCase);
      /* if (this.selectCase === 'AddContactOnly') {
        this.create();
      }
      if (this.selectCase === 'AddCase') {
        this.create();
      }
      else if (this.selectCase === 'CreateCase' && this.$refs.case.validate()) {
        this.create();
        // this.step = this.step + 1;
      } else {
        Swal.fire(
          'Attention CASE!',
          'All required fields must be completed.',
          'warning'
        );
        this.$vuetify.goTo('#caseAdd');
      }
      // create('a', '') */
      
    },
    parseDate (val) {
      let date = val !== undefined ? val : '';
      this.birthError = false;
      this.birthErrorMsg = '';
      if (date !== undefined && date.substr(0, 2) > 12 || (date.length > 0 && date.length < 8)) {
        this.age[this.person + 1] = '';
        this.birthError = true;
        this.birthErrorMsg = 'The date format must be mm/dd/yyyy';
      } else {
        let newDate = date ? date.substr(0, 2) + '/' + date.substr(2, 2) + '/' + date.substr(4) : '';
        this.age[this.person + 1] = newDate !== '' ? moment().diff(new Date(newDate).toISOString().substr(0, 10), 'years') + ' years old' : '';
        this.birthDate[this.person + 1] = newDate !== '' ? new Date(newDate).toISOString().substr(0, 10) : '';
      }
      this.$forceUpdate();
    },
    parseDeathDate (val) {
      let newDate = '';
      let date = val !== undefined ? val : '';
      this.deathError = false;
      this.deathErrorMsg = '';
      if (date !== undefined && date.substr(0, 2) > 12 || (date.length > 0 && date.length < 8)) {
        this.age[this.person + 1] = '';
        this.deathError = true;
        this.deathErrorMsg = 'The date format must be mm/dd/yyyy';
      } else {
        newDate = date ? date.substr(0, 2) + '/' + date.substr(2, 2) + '/' + date.substr(4) : '';
        this.deathDate[this.person + 1] = newDate !== '' ? new Date(newDate).toISOString().substr(0, 10) : '';
      }
      this.$forceUpdate();
    },

    setYear (e, p) {
      let item = e - 1;
      if (p === 'd') this.menuDeathday[e] = true;

      setTimeout(() => {
        if (p === 'b') {
          this.$refs.pickerB[this.person].activePicker = 'YEAR';
        }
        else
        {
          // this.menuDeathday[e] = true;
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
        this.emailQntOrg--;
      }
      console.log('delEmail', this.emailQnt[n - 1], this.emailQntOrg);
      this.$forceUpdate();
    },
    addEmail (n, e) {
      if (n) {
        this.emailQnt[n - 1]++;
      }
      else
      {
        this.emailQntOrg++;
      }
      this.$forceUpdate();
      console.log('addEmail', this.emailQnt[n - 1], this.emailQntOrg);
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
        this.phoneQntOrg--;
      }
      // this.phoneQnt[n - 1]--;
      this.$forceUpdate();
    },
    addPhone (n, i) {
      if (n) {
        this.phoneQnt[n - 1]++;
        this.$forceUpdate();
        setTimeout(() => {
          // console.log('addPhone', n, i, this.$refs.phone.length, this.$refs.phone[this.$refs.phone.length - 1].value, this.$refs.phone);
          this.$refs.phone[this.$refs.phone.length - 1].setValue('+1');
        }, 500);
        
      }
      else
      {
        this.phoneQntOrg++;
      }

      
      this.$forceUpdate();
    },
    async createNewUserOld (addPerson) {
      // console.log('createNewUser:', this.addUser);
      this.addUser.roles = this.addUser.roles.split(); // Change roles string to array - Need to change type in API
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
            this.step = this.person + 2;
          } 
          else
          {
            // this.$router.push('contact', () => {});
            this.snackbar = {
              show: true,
              color: 'green',
              text: 'Contact Created successfully!'
            };

            this.$router.go();
          }

          this.userSelected[this.person + 1] = data.id;
          // console.log('this.userItems: ', this.userItems);
        }, 300);

        
      }
    },
    async createNewUser (person) {
      console.log('createNewUser PERSON:', person, this.person);
      this.addUser.roles = this.addUserRoles[person].split(); // Change roles string to array - Need to change type in API
      this.addUser.username = this.addUserUsername[person];
      this.addUser.password = this.addUserPassword[person];
      this.addUser.portal_access = this.portal[person];
      let { data, error } = await create('User', this.addUser);
      if (error)
      {
        console.error('error on create User', error);
        this.snackbar = {
          show: true,
          color: 'red',
          text: error
        };
        return { data, error };
      } 
      else
      {
        console.log('NewUser:', data);
        this.userSelected[person] = data.id;
        setTimeout(() => {
          this.addUser = Object.assign({}, this.defaultAddUser);
          this.snackbar = {
            show: true,
            color: 'green',
            text: 'User Created successfully!'
          };
          
        }, 300);

        return data.id;
      }
    },
    async createNewOrganization () {
      if (this.$refs.organization.validate()) {
        this.addOrganization.human = [];
        this.addOrganization.phone = [];
        this.addOrganization.email = [];
        
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
              'endDate': this.organizationEndDate_ ? new Date(this.organizationEndDate_).toISOString() : null
            }
          );
          

          this.addOrganization.human.filter(column => {
            if (column.endDate === null) {
              delete column.endDate;
            }
            return column.endDate === null;
          });
        }

  
        for (let i = 0; i < this.phoneQntOrg; i++) {
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

        for (let i = 0; i < this.emailQntOrg; i++) {
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
          // console.log('Neworganization:', data, this.organozationItems);
          this.snackbar = {
            show: true,
            color: 'green',
            text: 'Organization Created successfully!'
          };
          setTimeout(() => {
            this.addOrganization = Object.assign({}, this.defaultAddOrganization);
            this.$router.push('organization');
          }, 300);
  
        }
      } else {
        Swal.fire(
          'Attention!',
          'All required fields must be completed.',
          'warning'
        );
        this.$vuetify.goTo('#organization');
      }
      
    },
    closeNewUser () {
      this.addUserDialog = false;
      setTimeout(() => {

        this.addUser = Object.assign({}, this.defaultAddUser);

        if (this.contactType === 'User') {
          this.$router.go();
          // this.$router.push('contact', () => {});
          this.snackbar = {
            show: true,
            color: 'green',
            text: this.contactType + ' Created successfully!'
          };
        }

      }, 300);
      
    },
    // eslint-disable-next-line complexity
    async create () {
      this.payload = [];
      this.humans = [];
      this.humansUpdate = [];
      
      // if (this.$refs.form[this.person].validate()) {
      for (let person = 0; person < this.personQnt; person++) {
        this.emails = [];
        this.phones = [];
        this.address = [];
        let item = person + 1;

        this.humanGroup = [];
        this.humanRelationship = [];
        this.humanOrganization = [];
        this.humanPrograms = [];

        // this.createNewUser(person + 1);

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

        

        this.payload.push(
          {
            // 'user': this.userSelected[person + 1],
            'user': this.userExistis[person + 1] === false ? await this.createNewUser(person + 1) : this.userSelected[person + 1],
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

        console.log('create: ', person, this.person, this.payload, this.userSelected, this.userSelected[person + 1]);

      }// for
        
      // if (this.personQnt === n) {
      this.payload.forEach((element, i) => {
        
        let newelement = element;
        // eslint-disable-next-line guard-for-in
        for (let field in newelement) {
          // console.log((newelement[field] === '' || newelement[field] === null || newelement[field] === undefined), 'payload foreach', field, element[field]);
          if (newelement[field] === '' || newelement[field] === null || newelement[field] === undefined || newelement[field].length === 0) delete element[field];
        }
        
        console.log('PAYLOAD element:', i, this.personQnt, element);
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
                  'startDate': this.caseStartDate[i + 1] ? new Date(this.caseStartDate[i + 1]).toISOString() : new Date().toISOString(),
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
                    'startDate': this.caseStartDateNew ? new Date(this.caseStartDateNew).toISOString() : new Date().toISOString(),
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
                  console.log(this.selectCase, casePayload, i, this.personQnt);

                  if (i + 1 === this.personQnt) this.createCase(casePayload);
                }
                  break;
            
                case 'AddCase': {
                  this.humansUpdate[i].case = [];
                  console.log('this.humansUpdate', this.humansUpdate[i]);
                  this.humansUpdate[i].case.push(
                    {
                      'case': this.caseSelected,
                      'role': this.roleSelected[i + 1],
                      'startDate': this.caseStartDate[i + 1] ? new Date(this.caseStartDate[i + 1]).toISOString() : new Date().toISOString(),
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

            if (this.wallet[i + 1] === true) {
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
            // console.log('personQnt >>>>>>>>>>>', this.personQnt, i);
            if (this.personQnt === (i + 1)) {
              
              // this.$router.push('contact', () => {});
              this.snackbar = {
                show: true,
                color: 'green',
                text: this.personQnt > 1 ? 'Family Created successfully!' : 'Contact Created successfully!'
              };
              this.$router.go();
            }
            else {
              console.log('Another Person >>>>>>>>>>>', this.personQnt, i + 1);
            }
            // this.humanItems.push(data);
          }
        })();
      });
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

    },
    async blurEmail (e, el) {
      // let nM = this.email.filter(x => x !== undefined);
      if (this.rules.email(e) === true) {
        this.successEmail[el] = false;
        this.successEmailMsg[el] = '';
        this.errorEmail[el] = false;
        this.errorEmailMsg[el] = '';

        let where = { username: e };
        // console.log('blurEmail', e, where, this.rules.email(e));
        let { error, data } = await getFromApi('User', this, where);
        if (error) {
          console.error(error);
          
        } else {
          if (data.length > 0) {
            this.errorEmail[el] = true;
            this.errorEmailMsg[el] = 'That email already exists';
            this.userSelected[this.person + 1] = data[0].id;
            this.userExistis[this.person + 1] = true;
            // console.log('blurEmail ERROR', this.errorEmail[el], this.errorEmailMsg[el]);
          } else {
            this.successEmail[el] = true;
            this.successEmailMsg[el] = 'This Email can be used';
            this.userSelected[this.person + 1] = '';
            this.userExistis[this.person + 1] = false;
            this.addUserUsername[this.person + 1] = e;
          }
          this.$forceUpdate();
          // console.log('blurEmail result', data);
        }
      }
      
      // console.log('blurEmail', e);
      
    },
    maskPhone (e, i) {
      let np = e.replace('-', '');
      this.phone[i] = np.replace(/\D+/g, '');

      if (np.length === 7) {
        this.phone[i] = np.substr(0, 3) + '-' + np.substr(3, np.length);
      }
      if (np.length === 8) {
        this.phone[i] = np.substr(0, 4) + '-' + np.substr(4);
      }
      if (np.length === 9) {
        this.phone[i] = np.substr(0, 5) + '-' + np.substr(5, np.length);
      }
      
    },
    cleanPortal (n) {
      this.userExistis[n] = false;
      this.$forceUpdate();
      console.log(n, this.userExistis[n]);
    },
  }
};

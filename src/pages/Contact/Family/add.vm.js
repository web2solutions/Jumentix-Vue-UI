/* global session */
import VueCropper from 'vue-cropperjs';
import Country from '@/api/country';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { create } from '../../../helpers/helpers';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as is from 'is_js';

export default {
  components: {
    VueCropper,
    VuePerfectScrollbar
  },
  name: 'FamilyAdd',
  data: () => ({
    countrys: Country,
    country: ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua &amp; Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L` Este', 'Togo', 'Tonga', 'Trinidad &amp; Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'],
    imgSrc: '/static/avatar.png',
    photo: '/static/avatar.png',
    editPhoto: false,
    family: {
      _id: null,
      name: '',
      email: '',
      photo: '/static/avatar.png',
      address_line_1: '',  
      address_line_2: '',
      address_city: '',
      address_state: '',
      address_zip: '',
      address_country: 'United States of America',
      phone_country_code: '+1',
      phone_area_number: '',
      phone_number: '',
      member: [],
      relation: [],
      social: [],
      service: [],
    },
    rules: {
      required: value => !!value || 'Required.',
      email: value => is.email(value) || 'Invalid e-mail.'
    }
  }),
  computed: {

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

  },
  created () {
    // let self = this;
  },
  methods: {
    async createFamily () {
      if (this.$refs.createFamily.validate()) {
        const ObjectID = require('bson-objectid');
        this.family._id = (ObjectID()).toString();
        let { data, error } = await create('Family', this.family);
        if (error)
        {
          console.error('error on create', error);
          this.snackbar = {
            show: true,
            color: 'red',
            text: error
          };
          return { data, error };
        } 
        else
        {
          Swal.fire({
            type: 'success',
            title: 'Family created successfully',
            showConfirmButton: false,
            timer: 2500,
            onClose: () => {
              this.$router.push({ path: '/contacts/family/view/' + data.id });
            }
          });
          console.error('Family Created successfully', data);
          
        }
      } else {
        Swal.fire(
          'Attention!',
          'All required fields must be completed.',
          'warning'
        );
      }
    }, 
    setImage (e) {
      const file = e.target.files[0];
      if (file.type.indexOf('image/') === -1) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Sorry, FileReader API not supported');
      }
    },
    showFileChooser () {
      this.editPhoto = true;
      this.$refs.input.click();

      console.log('this.$refs.cropper >>>>>>>>>>>>>>>>>>', this.$refs.cropper);
    },
    cropImage () {
      // get image data for post processing, e.g. upload or setting image src
      this.family.photo = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    savePhoto () {
      // get image data for post processing, e.g. upload or setting image src
      console.log(this.photo);
      this.family.photo = this.$refs.cropper.getCroppedCanvas().toDataURL();

      this.editPhoto = false;
    },
    move (offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },
    reset () {
      this.$refs.cropper.reset();
    },
    zoom (percent) {
      this.$refs.cropper.relativeZoom(percent);
    },
    setCallingCode (e) {
      let countrySelected = this.countrys.find(x => x.name === e);
      this.family.phone_country_code = countrySelected.callingCode;
      
    }
  }
};

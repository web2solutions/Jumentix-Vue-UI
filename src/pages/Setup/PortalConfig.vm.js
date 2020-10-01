/* global session moment */
import VueCropper from 'vue-cropperjs';
import { update, getLocalCollection } from '../../helpers/helpers';
export default {
  components: {
    VueCropper
  },
  name: 'Portal',
  props: {
    bus: {
      type: Object,
      default: function () { return {} },
    }
  },
  data: () => ({
    imgSrc: '/static/logo.png',
    logo: '/static/logo.png',
    editLogo: false,
    title: ''
  }),
  computed: {

  },
  watch: {

  },
  created () {
    // let self = this;
  },
  mounted () {
    // this.$vuetify.goTo('#RolesTop');
    this.getConf();
  },
  methods: {
    async getConf () {
      let { error, data } = await getLocalCollection('ConfigurationPortal');
      if (data[0])
      {
        // console.info(data[0]);
        this.selectedConfId = data[0]._id;
        if (data[0].logo) this.imgSrc = data[0].logo;
        if (data[0].logo) this.logo = data[0].logo;
        if (data[0].title) this.title = data[0].title;
      }
    },
    goToUrl (e) {
      this.$router.push({ path: '/setup/' + e });
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
      this.editLogo = true;
      this.$refs.input.click();
    },
    cropImage () {
      // get image data for post processing, e.g. upload or setting image src
      this.logo = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    saveLogo () {
      // get image data for post processing, e.g. upload or setting image src
      console.log(this.logo);
      this.logo = this.$refs.cropper.getCroppedCanvas().toDataURL();

      this.editLogo = false;
      /* (async () => {
        let r = await update('ConfigurationPortal', { title: 'Demo Portal', logo: this.logo }, this.selectedConfId);
        console.log(r);
      })(); */
    },
    async save () {
      let { error, data } = await update('ConfigurationPortal', { title: this.title, logo: this.logo }, this.selectedConfId);
      if (data)
      {
        console.info('ConfigurationPortal updated', data);
        this.bus.$emit('nextStep', 5);
      }
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
    
  }
};

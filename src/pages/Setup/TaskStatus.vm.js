/* global session moment */
import { getLocalCollection, getCollection, create, update } from '../../helpers/helpers';
export default {
  components: {
  },
  name: 'TaskStatus',
  props: {
    bus: {
      type: Object,
      default: function () { return {} },
    }
  },
  data: () => ({
    headers: [
      { text: 'Status', align: 'left', value: 'status' },
      { text: 'Label', align: 'left', value: 'label' }
    ],
    items: [],
    max25chars: v => v.length <= 25 || 'Input too long!',
    snack: false,
    snackColor: '',
    snackText: '',
    status: [
      { status: 'Approved', label: 'Approved', exists: false },
      { status: 'In Progress', label: 'In Progress', exists: false },
      { status: 'New', label: 'New', exists: false },
      { status: 'Rejected', label: 'Rejected', exists: false },
      { status: 'Submitted', label: 'Submitted', exists: false },
      { status: 'Viewed', label: 'Viewed', exists: false },
    ]
  }),
  computed: {

  },
  watch: {

  },
  created () {
    // let self = this;
    this.feedGrid('TaskStatus');
  },
  mounted () {
    // this.$vuetify.goTo('#RolesTop');
  },
  methods: {
    goToUrl (e) {
      this.$router.push({ path: '/setup/' + e });
    },
    async feedGrid (entity) {
      let { data, total, error } = await getCollection(entity, 1000);
      if (error) {
        console.log(error);
      } else {
        this.items = data;

        this.items.forEach(element => {
          this.status.forEach((item, index) => {
            if (element.status === item.status) this.status[index].exists = true;
          });
        });

        this.status.forEach(async (item, index) => {
          if (item.exists === false) await this.createStatus(item);
        });
        // console.log(entity, this.items, this.status);
      }
    },
    async createStatus (payload) {
      let { data, total, error } = await create('TaskStatus', payload);
      if (error) {
        console.log(error);
      } else {
        //
        this.items.push(data);
      }
    },
    async save (item) {
      let { data, total, error } = await update('TaskStatus', item, item.id);
      if (error) {
        this.snack = true;
        this.snackColor = 'error';
        this.snackText = error;
        console.log(error);
      } else {
        //
        this.snack = true;
        this.snackColor = 'success';
        this.snackText = 'Label saved';
      }
      
      
    },
    cancel () {
      this.snack = true;
      this.snackColor = 'error';
      this.snackText = 'Canceled';
    },
    open () {
      this.snack = true;
      this.snackColor = 'info';
      this.snackText = 'Dialog opened';
    },
    close () {
      console.log('Dialog closed');
    }
    
  }
};

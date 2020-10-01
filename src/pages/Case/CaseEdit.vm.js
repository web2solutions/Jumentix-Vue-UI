/* global session moment */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { update, getCollection, getOnLocalCollection, getFromApi, fillField } from '../../helpers/helpers';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'CaseEdit',
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    rules: {
      required: value => !!value || 'Required.',
    },
    caseID: '',
    caseSchema: {
      type: '',
      status: '',
      family: '',
      display_name: '',
      case_number: '',
      group: [],
      client: [],
      service: [
        {
          _id: '',
          who: '',
          role: '',
          startDate: '',
          endDate: ''
        }
      ],
      phase: [
        {
          _id: '',
          phase: '',
          order: 0,
          task: [
            {
              task_template: '',
              who: '',
              order: 0,
              task: [
                {
                  task_template: '',
                  who: '',
                  order: 0,
                  task: [],
                  progress: [],
                  survey: [],
                  status: ''
                }
              ],
              progress: [],
              survey: [],
              status: ''
            }
          ]
        }
      ],
      notes: [
        {
          _id: '',
          author: '',
          type: '',
          form: '',
          subject: '',
          note: '',
          priority: '',
          incident: '',
          bill_code: '',
          drawee: '',
          duration_hour: 0,
          duration_minute: 0,
          startDate: '',
          endDate: '',
          file: [
            {
              label: '',
              file: '',
              memo: ''
            }
          ]
        }
      ],
      is_placement: false,
      cases: [],
      startDate: new Date().toISOString().substr(0, 10),
      endDate: '',
      file: [
        {
          label: '',
          file: '',
          memo: '',
        }
      ]
    },
    startDatePicker: false,
    endDatePicker: false,
    caseStatusItem: [],
    caseTypeItem: [],
    caseFamilyItem: [],
    clientsHeaders: [
      { text: 'Name', align: 'left', value: 'who' },
      { text: 'Role', align: 'left', value: 'role' },
      { text: 'Sub Role', align: 'left', value: 'sub_role' },
      { text: 'Type', value: 'type' },
      { text: 'Join to Case', align: 'center', width: 100, value: '' }
    ],
    casesHeaders: [
      { text: 'Name', align: 'left' }
    ],
    notesHeaders: [
      { text: 'Subject', align: 'left', value: 'subject' },
      { text: 'Type', align: 'left', value: 'type' },
      { text: 'Author', align: 'left', value: 'author' }
    ],
    serviceHeaders: [
      { text: 'Who', align: 'left', value: 'who' },
      { text: 'Role', align: 'left', value: 'role' },
      { text: 'Whose', align: 'left', value: 'whose' },
      { text: 'Outside', align: 'left', value: 'isOutside' }
    ],
    groupsHeaders: [
      { text: 'Name', align: 'left', value: 'id' },
      { text: 'Join to Group', align: 'center', width: 100, value: '' }
    ],
    phasesHeaders: [
      { text: 'Name', align: 'left', value: 'phase' },
      { text: 'Tasks', align: 'left', value: 'tasks', width: 90 }
    ],
    tasksHeaders: [
      { text: 'Name', align: 'left', value: 'phase' },
      { text: 'Assignment', align: 'left', value: 'assignment' },
      { text: 'Role', align: 'left', value: 'role' },
      { text: 'Sub Role', align: 'left', value: 'sub_role' },
      { text: 'Who', align: 'left', value: 'who' },
      { text: 'Status', align: 'left', value: 'status' }
    ],
    snack: false,
    snackColor: '',
    snackText: '',
    max25chars: v => v.length <= 25 || 'Input too long!',
    subRoleItems: [],
    clientItems: [],
    selected: [],
    caseGroupItem: [],
    groupSelected: [],
    caseGroupServiceItem: [],
    actions: [
      {
        text: 'View Item',
        icon: 'visibility',
        click: this.handleViewItem
      },
      {
        text: 'Edit Item',
        icon: 'edit',
        click: this.handleEditItem
      },
      {
        text: 'Delete Item',
        icon: 'delete',
        click: this.handleDeleteItem
      }
    ]
  }),
  computed: {
    computedCaseStartDate (e) {
      return this.caseSchema.startDate ? moment(this.caseSchema.startDate).format('L') : '';
    },
    computedCaseEndDate (e) {
      return this.caseSchema.endDate ? moment(this.caseSchema.endDate).format('L') : '';
    },
    selectedAllGroup () {
      return this.caseSchema.group.length === this.caseGroupItem.length
    },
    selectedSomeGroup () {
      return this.caseSchema.group.length > 0 && !this.selectedAllGroup
    },
    groupSelectionIcon () {
      if (this.selectedAllGroup) return 'check_box'
      if (this.selectedSomeGroup) return 'indeterminate_check_box'
      return 'check_box_outline_blank'
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
  watch: {

  },
  created () {
    this.feedItem('CaseStatus');
    this.feedItem('CaseType');
    this.feedItem('Family');
    this.feedItem('Group');
  },
  mounted () {
    // this.$forceUpdate();
    this.caseID = this.$route.params.id;

    console.log('Mounted', this.caseID);
    if (this.caseID) this.getItems('Case', this.caseID);
  },
  methods: {
    async getItems (entity, id) {
      // let { data, error } = await getOne(entity, id);
      let { data, error } = await getFromApi(entity, this, { _id: id }, 'group')
      if (error) {
        console.log(error);
      } else {
        this.caseSchema = Object.assign({}, data[0]);
        let tasksTotal = 0;
        this.caseSchema.phase.forEach(async (phases, index) => {
          let phaseData = await getOnLocalCollection('Phase', phases.phase);
          tasksTotal += phaseData.data.task.length;
          this.caseSchema.phase[index].tasksTotal = tasksTotal;
        });
        let family = await getOnLocalCollection('Family', this.caseSchema.family);
        this.caseSchema.family = family.data;
        this.selected = this.caseSchema.client;
        
        this.clientItems = Object.assign(this.caseSchema.family.member, this.caseSchema.client);
        console.log('Data getItems: ', this.caseSchema);
      }
    },
    async feedItem (entity) {
      let { data, error } = await getCollection(entity, 1000);
      if (error) {
        console.log(error);
      } else {
        switch (entity) {
          case 'CaseStatus':
            this.caseStatusItem = data;
            break;
          case 'CaseType':
            this.caseTypeItem = data;
            break;
          case 'Family':
            this.caseFamilyItem = data;
            break;
          case 'Group':
            this.caseGroupItem = data;
            break;
        
          default:
            break;
        }
        // this.rolesItem.forEach(element => { element.clicked = false });
        // console.log('feedItem', entity, data);
      }
    },
    xfillField (collection, _id, fieldId) {
      // console.log('xfillField', collection, _id, fieldId, this.subRoleItems[_id]);
      // if (collection.collection === 'Role' && this.subRoleItems[_id] === undefined) this.open(_id)
      fillField(this, collection, _id, fieldId);
    },
    save (id) {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    async open (id) {
      // this.subRoleItems[id] = []
      let where = { 'role': id };
      let { data, total, error } = await getFromApi('SubRole', this, where);
      if (error) {
        console.log(error);
      } else {
        if (data.length > 0) {
          this.subRoleItems[id] = data;
        }
        // console.log('Data SubRoles: >>>>>>>>>>>>> ', this.subRoleItems[id], this.subRoleItems);
      }
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Select a item'
    },
    setSubRole (e) {
      console.log('setSubRole', e)
    },
    close () {
      console.log('Dialog closed')
    },
    removeChip (item) {
      console.log('removeChip', item)
      const index = this.caseSchema.group.indexOf(item)
      if (index >= 0) this.caseSchema.group.splice(index, 1)
    },
    toggleGroupSelection () {
      this.$nextTick(() => {
        if (this.selectedAllGroup) {
          this.caseSchema.group = []
        } else {
          this.caseSchema.group = []
          this.caseGroupItem.forEach(group => {
            this.caseSchema.group.push(group._id)
          });
          // this.caseSchema.group = this.caseGroupItem.slice()
        }
      })
    },
    groupClicked (e) {
      this.groupSelected = [e];
      console.log('groupClicked', e, this.groupSelected = [e])
      // this.caseGroupServiceItem = props.item.task
    },
    handleViewItem () { 
      // 
    },
    handleEditItem () { 
      // 
    },
    handleDeleteItem () { 
      //
    }
  }
};

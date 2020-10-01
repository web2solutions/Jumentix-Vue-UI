/* global session */
import {
  getFromApi,
  create,
  getOnLocalCollection,
  getOne,
  fillField,
  getCollection
} from '../../helpers/helpers';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar
  },
  props: ['id'],
  name: 'Case',
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
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
      is_placement: true,
      cases: [],
      startDate: '',
      endDate: '',
      file: [
        {
          label: '',
          file: '',
          memo: '',
        }
      ]
    },
    clientsHeaders: [
      { text: 'Name', align: 'left', value: 'who' },
      { text: 'Role', align: 'left', value: 'role' },
      { text: 'Sub Role', align: 'left', value: 'sub_role' },
      { text: 'Type', align: 'left', value: 'type' }
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
      { text: 'Name', align: 'left' }
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
    tasksItems: [],
    subTasksItems: [],
    noteSelected: [],
    taskSelected: [],
    subTaskSelected: []
  }),
  computed: {

  },
  beforeRouteEnter (to, from, next) {
    if (!session.isOnline()) {
      // return;
      next({ path: '/login' }).catch(() => { });
    }
    else {
      next();
    }
  },
  watch: {
    id: {
      handler () {
        console.log('watched caseID', this.id, this.caseID);
        this.getItems('Case', this.id);
        // this.$forceUpdate();
      },
      deep: true
    }
  },
  created () {
    // this.$forceUpdate();
    console.log('Created', this.id, this.caseID);
    // let self = this;
  },
  mounted () {
    // this.$forceUpdate();
    this.caseID = this.$route.params.id;

    console.log('Mounted', this.id, this.caseID);
    if (this.caseID) this.getItems('Case', this.caseID);
  },
  methods: {
    async getItems (entity, id) {
      let { data, total, error } = await getOne(entity, id);
      if (error) {
        console.log(error);
      } else {
        this.caseSchema = Object.assign({}, data);
        let tasksTotal = 0;
        this.caseSchema.phase.forEach(async (phases, index) => {
          let phaseData = await getOnLocalCollection('Phase', phases.phase);
          tasksTotal += phaseData.data.task.length;
          this.caseSchema.phase[index].tasksTotal = tasksTotal;
        });
        console.log('Data getItems: ', this.caseSchema);
      }
    },
    xfillField (collection, _id, fieldId) {
      fillField(this, collection, _id, fieldId);
    },
    async feedTasks (e) {
      this.tasksItems = [];
      this.subTasksItems = [];
      let populate = 'task';
      let where = { '_id': e };

      let { data, total, error } = await getFromApi('Phase', this, where, populate);
      // let { data, total, error } = await getOne('Phase', e);
      if (error) {
        console.log(error);
      } else {
        if (data.length > 0) {
          this.tasksItems = data[0].task;
        }

        console.log('Data: >>>>>>>>>>>>> ', data);
      }
      console.log(e);
    },
    async feedSubTasks (e) {
      console.log('feedSubTasks: >>>>>>>>>>>>> ', e);
      this.subTasksItems = [];
      this.subTasksItems = e;
      if (e.length > 0) {

        let tasksArray = [];
        let populate = 'task';
        e.forEach(task => {
          tasksArray.push({ _id: task });
        });
        let where = tasksArray.length !== 0 ? { $or: tasksArray } : '';

        let { data, total, error } = await getFromApi('TaskTemplate', this, where, populate);
        if (error) {
          console.log(error);
        } else {
          if (data.length > 0) {
            this.subTasksItems = data;
          }
          console.log('Data SubTasks: >>>>>>>>>>>>> ', data);
        }
      }
    },
    rowClick (selectedItem) {
      this.noteSelected = [selectedItem];
    }
  }
};

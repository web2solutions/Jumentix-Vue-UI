import Vue from 'vue';
import DatetimePicker from '../../../../components/DatetimePicker';
import {
  getFromApi,
  getOne,
  create,
  update,
  getLocalCollection,
  getOnLocalCollection,
  showSnack
} from '../../../../helpers/helpers';

export default {
  name: 'TaskAdd',

  props: { 
    groupID: String, 
    subGroupID: String, 
    bottonType: String, 
    status: String, 
    bus: {
      type: Object,
      // default: function () { return {} },
    }
  },
  components: {
    DatetimePicker
  },
  data () {
    return {
      pagination: {
        sortBy: '_id',
        descending: true,
        page: 1,
        rowsPerPage: 100, // -1 for All
        totalItems: 0
      },
      snack: false,
      snackColor: '',
      snackText: '',
      snackbar: {
        show: false,
        color: '',
        text: ''
      },
      valid: false,
      step: 1,
      dialog: false,
      taskAdd: {
        name: '',
        case: [],
        type: 'Survey',
        notification_type: 'No Notification',
        group: [],
        caseworker: [],
        auto_approve: false,
        status: '',
        descrition: '',
        progres: [],
        disable: false,
        ispublic: false,
        expire: '',
        event: '',
        survey: '',
        reference_type: 'Survey',
        url: '',
        file: []
      },
      taskAddDefault: {
        name: '',
        case: [],
        type: 'Survey',
        notification_type: 'No Notification',
        group: [],
        caseworker: [],
        auto_approve: false,
        status: '',
        descrition: '',
        progres: [],
        disable: false,
        ispublic: false,
        expire: '',
        event: '',
        survey: '',
        reference_type: 'Survey',
        url: '',
        file: []
      },
      groups: [],
      groupsItems: [],
      taskItems: [],
      taskTypeItems: ['Document Upload', 'Event Signup', 'Form - Internal', 'Form - External', 'Data merge with/without signature', 'URL', 'Document Download', 'Survey', 'Reference', 'Payment'],
      notificationTypeItems: ['No Notification', 'Notify Assigned Caseworker(s)', 'Notify Caseworker(s) and Message Group', 'Notify Message Group', 'Notify Caseworker(s) On Each Submission', 'Notify Assigned Caseworker(s) and Message Group'],
      taskStatusItems: [],
      selectGroup: 'AddTaskOnly',
      taskGroup: null,
      taskGroupItems: [],
      taskSubGroup: null,
      taskSubGroupItems: [],
      subGroupDisabled: true,
      dialog_loading: false,
      addGroupDialog: false,
      addGroup: {
        name: '',
        task: [],
        group: []
      },
      defaultAddGroup: {
        name: '',
        task: [],
        group: []
      },
      addSubGroupDialog: false,
      addSubGroup: {
        name: '',
        task: [],
        task_group: '',
        group: []
      },
      defaultAddSubGroup: {
        name: '',
        task: [],
        task_group: '',
        group: []
      },
      taskCaseworkersItems: [],
      taskCasesItems: [],
      eventItems: [],
      surveyItems: [],
      referenceTypeItems: ['Survey', 'Reference'],
      taskEdit: false,
      taskEditID: null,
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid e-mail.';
        }
      },
      
    };
  },

  computed: {
    //
  },

  updated () {
    //
  },

  mounted () {
    if (this.groupID) {
      this.selectGroup = 'InsertInGroup';
      this.taskGroup = this.groupID;
    }
    if (this.subGroupID) {
      this.selectGroup = 'InsertInSubGroup';
      this.taskGroup = this.groupID;
      this.taskSubGroup = this.subGroupID;
    }
    if (this.bus !== undefined) {
      this.bus.$on('cardClick', (id, status) => {
        if (status === this.status) {
          this.dialog_loading = true;
          this.taskEditID = id;
          this.taskEdit = true;
          this.editTask(id);
        }
      });
    }
    
  },

  created () {
    //
  },
  watch: {
    dialog (val) {
      if (val === true) {
        this.feedSelects('TaskStatus');
      }
    },
    selectGroup (e) {
      switch (e) {
        case 'InsertInGroup':
          this.feedSelects('TaskGroup');
          this.taskGroup = this.groupID !== '' ? this.groupID : [];
          break;
        case 'InsertInSubGroup':
          this.feedSelects('TaskGroup');
          this.taskGroup = this.groupID !== '' ? this.groupID : [];
          if (this.groupID) this.feedSelects('TaskSubGroup', this.groupID);
          break;
      
        default:
          break;
      }
    },
    taskGroup (e) {
      this.taskSubGroupItems = [];
      this.subGroupDisabled = true;
      if (this.selectGroup === 'InsertInSubGroup' && e !== undefined) {        
        this.feedSelects('TaskSubGroup', e);
      }
    },
    step (val) {
      if (!this.taskGroup) {
        this.selectGroup = 'InsertInGroup';
        this.taskGroup = this.groupID;
      }

      if (val === 3) {
        this.feedSelects('Human');
        this.feedSelects('Case');
      }

      if (val === 4) {
        this.feedSelects('Group');
      }

      if (val === 5) {
        this.feedSelects('Event');
        this.feedSelects('Survey');
      }
    }
    
  },
  methods: {
    async feedSelects (entity, where = null) {
      this.dialog_loading = true;
      let result = null;
      if (where) {
        where = { 'task_group': where };
        result = await getFromApi(entity, this, where);
      } else {
        result = await getLocalCollection(entity);
      }

      if (result.error) {
        console.log(result.error);
      } 
      else 
      {
        switch (entity) {
          case 'Group':
            this.groupsItems = result.data;
            break;
          case 'TaskGroup':
            this.taskGroupItems = result.data;
            break;
          case 'TaskSubGroup':
            this.taskSubGroupItems = result.data;
            this.subGroupDisabled = false;
            break;
          case 'Task':
            this.taskItems = result.data;
            break;
          case 'TaskStatus':
            this.taskStatusItems = result.data;
            this.taskAdd.status = this.taskStatusItems.filter(status => {
              return status.label === this.status;
            });
            this.taskAdd.status = this.taskAdd.status.length > 0 ? this.taskAdd.status[0].id : '';
            break;
          case 'Human':
            this.taskCaseworkersItems = result.data;
            break;
          case 'Case':
            this.taskCasesItems = result.data;
            break;
          case 'Event':
            this.eventItems = result.data;
            break;
          case 'Survey':
            this.surveyItems = result.data;
            break;

          default:
            break;
        }
        this.dialog_loading = false;
        
      }
    },
    cancelNewTask () {
      this.dialog = false;
      this.step = 1;
      setTimeout(() => {
        this.taskAdd = Object.assign({}, this.taskAddDefault);
      }, 300);
    },
    closeNew () {
      this.addGroupDialog = false;
      this.addSubGroupDialog = false;
      setTimeout(() => {

        this.addGroup = Object.assign({}, this.defaultAddGroup);
        this.addSubGroup = Object.assign({}, this.defaultAddSubGroup);

      }, 300);
    },
    openAddDialog (dialog) {
      if (dialog === 'group') {
        this.addGroupDialog = true;
      } else {
        this.addSubGroupDialog = true;
      }
      this.feedSelects('Group');
      this.feedSelects('TaskGroup');
      this.feedSelects('Task');
    },
    async addNew (entity, ref, payload) {
      if (this.$refs[ref].validate()) {
        this.dialog_loading = true;
        let { data, error } = await create(entity, payload);
        if (error)
        {
          console.error('error on update', error);
        } 
        else
        {
          console.log('addNew ', entity, data);
          this.addSubGroupDialog = false;
          this.$router.push({ path: '/tasks-sub-group/' + data.id });

          setTimeout(() => {
            // this.addGroup = Object.assign({}, this.defaultAddGroup);
            this.addSubGroup = Object.assign({}, this.defaultAddSubGroup);
            // this.getData('TaskGroup');
          }, 300);
        }
      }
    },
    async setTaskGroup (groupID, task, subGroupID) {
      let entity = '';
      if (subGroupID) {
        groupID = subGroupID;
        entity = 'TaskSubGroup';
      } else {
        entity = 'TaskGroup';
      }
      console.log('setTaskGropup', groupID, this.groupID, task, subGroupID);
      let { data, error } = await getOnLocalCollection(entity, groupID);
      if (error) {
        console.log(error);
      } else {
        data.task.push(task.id);
        let updateTask = await update(entity, data, groupID);
        if (updateTask.error)
        {
          console.error('error on update Task', updateTask.error);
        }
        else
        {
          showSnack(this, false, 'Task ' + task.name + ' Created successfully!');
          this.bus.$emit('taskCreated', data);
          
          setTimeout(() => {
            this.taskAdd = Object.assign({}, this.taskAddDefault);
          }, 300);
                  
        }
      }
    },
    async createNewTask () {
      if (this.$refs.formTaskAdd.validate()) {
        
        for (const key in this.taskAdd) {
          if (this.taskAdd.hasOwnProperty(key)) {
            const element = this.taskAdd[key];
            if (element.length === 0 || element === '') {
              delete this.taskAdd[key];
            }
          }
        }
        let result = '';
        let actionTxt = '';
        if (this.taskEdit === true) {
          result = await update('Task', this.taskAdd, this.taskEditID);
          actionTxt = 'Edited';
        } else {
          result = await create('Task', this.taskAdd);
          actionTxt = 'Created';
        }
        
        if (result.error)
        {
          console.error('error on create task', result.error);
          showSnack(this, 'Error on create task: ' + result.error);
          return result.error;
        } 
        else
        {
          this.dialog = false;
          this.taskGroup = this.groupID !== '' && this.taskGroup === null ? this.groupID : this.taskGroup;
          
          if (this.taskSubGroup) {
            this.setTaskGroup(this.taskGroup, result.data, this.taskSubGroup);
          } 
          else if (this.taskGroup) {
            this.setTaskGroup(this.taskGroup, result.data);
          }
          else {

            showSnack(this, false, 'Task ' + result.data.name + ' ' + actionTxt + ' successfully!');
            this.bus.$emit('taskCreated', result.data);

            setTimeout(() => {
              this.taskAdd = Object.assign({}, this.taskAddDefault);
            }, 300);
          }

        }
      }
      else
      {
        this.step = 1;
        showSnack(this, 'Please check the form');
      }

    },
    async editTask (id) {

      console.log('cardClick _+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+', this.status, id);
      let { data, error } = await getOnLocalCollection('Task', id);
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setTimeout(() => {
          this.step = 1;
          this.taskAdd = Object.assign({}, data);
        }, 300);

        this.dialog = true;
        this.dialog_loading = false;
      }

    }
  }
};

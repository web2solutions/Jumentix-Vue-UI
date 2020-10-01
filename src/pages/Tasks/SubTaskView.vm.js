/* global session */
import { Tasks, getTaskByStatus, getTaskWorker } from './API/tasks';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import {
  getOne,
  getFromApi,
  getCollection,
  getOnLocalCollection
} from '../../helpers/helpers';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'SubTaskView',
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: false,
      page: 1,
      rowsPerPage: 100, // -1 for All
    },
    rowsPerPageItems: [4, 8, 12],
    groupID: '',
    caseID: '',
    taskID: '',
    tasks: Tasks,
    phaseID: '',
    phaseItem: '',
    groupItem: '',
    caseItem: '',
    taskItems: [],
    taskItem: '',
    statusItems: []
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
  mounted () {  
    // console.log('this.$route', this.$route);
    this.taskID = this.$route.params.task;
    this.groupID = this.$route.params.group;
    this.caseID = this.$route.params.case;
    this.phaseID = this.$route.params.phase;
    this.feedItems('TaskStatus');
    if (this.taskID) this.getItems('TaskTemplate', this.taskID, 'task.status');
    if (this.groupID) this.getItems('Group', this.groupID);
    if (this.caseID) this.getItems('Case', this.caseID);
    if (this.phaseID) this.getItems('Phase', this.phaseID);
  },
  created () {
    // let self = this;
  },
  methods: {
    async getItems (entity, id, populate = '') {
      let where = { _id: id };
      let { data, total, error } = await getFromApi(entity, this, where, populate);
      if (error) {
        console.log(error)
      }
      else 
      {
        switch (entity) {
          case 'Case':
            this.caseItem = data[0];
            break;

          case 'Phase':
            this.phaseItem = data[0];
            break;

          case 'Group':
            this.groupItem = data[0];
            break;

          case 'TaskTemplate':
            this.taskItem = data[0];
            this.taskItem.task.forEach((task, index) => {
              switch (task.status.status) {
                case 'Approved':
                  this.taskItem.task[index].status.icon = 'fas fa-check-circle'
                  this.taskItem.task[index].status.color = 'green'
                  break;
    
                case 'Rejected':
                  this.taskItem.task[index].status.icon = 'error'
                  this.taskItem.task[index].status.color = 'red'
                  break;
    
                case 'New':
                  this.taskItem.task[index].status.icon = 'new_releases'
                  this.taskItem.task[index].status.color = 'blue'
                  break;
    
                case 'In Progress':
                  this.taskItem.task[index].status.icon = 'fas fa-spinner'
                  this.taskItem.task[index].status.color = 'blue'
                  break;
                    
                case 'Submitted':
                  this.taskItem.task[index].status.icon = 'fas fa-clipboard-list'
                  this.taskItem.task[index].status.color = 'orange'
                  break;
                    
                case 'Viewed':
                  this.taskItem.task[index].status.icon = 'visibility'
                  this.taskItem.task[index].status.color = 'grey'
                  break;
                  
                default:
                  break;
              }
            });
            break;
        
          default:
            break;
        }
      }
    },
    async feedItems (entity) {
      let { data, total, error } = await getCollection(entity, 1000);
      if (error) {
        console.log(error);
      } else {
        this.statusItems = data;
      }
    },
    async clickFilterMenu (e) {
      await this.getItems('TaskTemplate', this.taskID, 'task.status');
      this.taskItem.task = e === false ? this.taskItem.task : this.taskItem.task.filter(x => x.status.id === e);
    },
    clickCardAction (e) {
      console.log(e);
    },
    async _fillField (collection, id, elementId) {
      let { data, total, error } = await getOnLocalCollection(collection, id);
      if (error)
      {
        console.error('error get ' + collection, error);
        return { data, error };
      } 
      else
      {
        
        if (data) {
          // console.log('_fillField >>>>>>>>', collection, id, data.name, elementId);
          if (document.getElementById(elementId)) {
            document.getElementById(elementId).innerHTML = collection === 'Role' ? data.name : '/' + data.name;
          }
        }
        
      }
    } 
  }
};

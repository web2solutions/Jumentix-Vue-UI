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
  name: 'TaskView',
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
    tasks: Tasks,
    phases: '',
    groupItem: '',
    caseItem: '',
    taskItems: [],
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
    this.groupID = this.$route.params.group;
    this.caseID = this.$route.params.case;
    this.feedItems('TaskStatus');
    if (this.groupID) this.getItems('Group', this.groupID);
    if (this.caseID) this.getItems('Case', this.caseID, 'phase.phase');
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
            this.getPhases();
            break;

          case 'Group':
            this.groupItem = data[0];
            break;
        
          default:
            break;
        }
      }
    },
    async getPhases (status = false) {
      this.taskItems = [];
      this.caseItem.phase.forEach(async phase => {
        if (phase.phase) {
          let taskList = [];
          phase.phase.task.forEach(task => {
            taskList.push({ _id: task })
          });

          let where = status !== false ? { $and: [{ 'status': status }], $or: taskList } : { $or: taskList };          
          let { data, total, error } = await getFromApi('TaskTemplate', this, where, 'status');
          if (error) {
            console.log(error)
          }
          else 
          {
            data.forEach((task, index) => {
              switch (task.status.status) {
                case 'Approved':
                  data[index].status.icon = 'fas fa-check-circle'
                  data[index].status.color = 'green'
                  break;

                case 'Rejected':
                  data[index].status.icon = 'error'
                  data[index].status.color = 'red'
                  break;

                case 'New':
                  data[index].status.icon = 'new_releases'
                  data[index].status.color = 'blue'
                  break;

                case 'In Progress':
                  data[index].status.icon = 'fas fa-spinner'
                  data[index].status.color = 'blue'
                  break;
                
                case 'Submitted':
                  data[index].status.icon = 'fas fa-clipboard-list'
                  data[index].status.color = 'orange'
                  break;
                
                case 'Viewed':
                  data[index].status.icon = 'visibility'
                  data[index].status.color = 'grey'
                  break;
              
                default:
                  break;
              }
            });
            this.taskItems.push({ phase: phase.phase, tasks: data });
          }
        }
        else 
        {
          this.taskItems.push({ phase: '', tasks: [] });
        }
      });
      // console.log(' this.taskItems', this.taskItems)
    },
    async feedItems (entity) {
      let { data, total, error } = await getCollection(entity, 1000);
      if (error) {
        console.log(error);
      } else {
        this.statusItems = data;
      }
    },
    clickFilterMenu (e) {
      console.log('Clicked: ', e);
      this.getPhases(e)
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
          // console.log('_fillField >>>>>>>>', collection, id, data.name);
          document.getElementById(elementId).innerHTML = collection === 'Role' ? data.name : '/' + data.name;
        }
        
      }
    } 
  }
};

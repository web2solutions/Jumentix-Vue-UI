/* global session moment */
import is from 'is_js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { getFromApi, getCollection, create, update, remove, getOne } from '../../helpers/helpers';
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
    pagination: {
      sortBy: '_id',
      descending: false,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    headers: [
      { text: 'Name', align: 'left', value: 'name' },
      { text: 'Role', align: 'left', value: 'role' },
      { text: 'Sub Role', align: 'left', value: 'sub_role' },
      { text: 'Assignment', align: 'left', value: 'assignment' },
      { text: 'Has Sub Task', align: 'left', value: 'has_Sub_Task' },
      { text: 'Action', align: 'center', value: 'name' }
    ],
    taskTemplateSchema: {
      name: '',
      description: '',
      event: null,
      form: null,
      reference: null,
      survey: null,
      role: null,
      sub_role: null,
      type: 'Survey',
      notification_type: 'No Notification',
      auto_approve: false,
      disable: false,
      expire_unit: 'Never',
      expire: 0,
      rules: [],
      rule_action: '',
      rule_match: '',
      rule_trigger_when: '',
      url: '',
      assignment: 'Any',
      task: [],
      status: ''
    },
    taskTemplateSchemaDefault: {
      name: '',
      description: '',
      event: null,
      form: null,
      reference: null,
      survey: null,
      role: null,
      sub_role: null,
      type: 'Survey',
      notification_type: 'No Notification',
      auto_approve: false,
      disable: false,
      expire_unit: 'Never',
      expire: 0,
      rules: [],
      rule_action: '',
      rule_match: '',
      rule_trigger_when: '',
      url: '',
      assignment: 'Any',
      task: [],
      status: ''
    },
    subTaskTemplateSchema: {
      name: '',
      description: '',
      event: null,
      form: null,
      reference: null,
      survey: null,
      role: null,
      sub_role: null,
      type: 'Survey',
      notification_type: 'No Notification',
      auto_approve: false,
      disable: false,
      expire_unit: 'Never',
      expire: 0,
      rules: [],
      rule_action: '',
      rule_match: '',
      rule_trigger_when: '',
      url: '',
      assignment: 'Any',
      task: [],
      status: ''
    },
    subTaskTemplateSchemaDefault: {
      name: '',
      description: '',
      event: null,
      form: null,
      reference: null,
      survey: null,
      role: null,
      sub_role: null,
      type: 'Survey',
      notification_type: 'No Notification',
      auto_approve: false,
      disable: false,
      expire_unit: 'Never',
      expire: 0,
      rules: [],
      rule_action: '',
      rule_match: '',
      rule_trigger_when: '',
      url: '',
      assignment: 'Any',
      task: [],
      status: ''
    },
    subTaskDialog: false,
    editedSubTaskIndex: -1,
    subSubTaskTemplateSchema: {
      name: '',
      description: '',
      event: null,
      form: null,
      reference: null,
      survey: null,
      role: null,
      sub_role: null,
      type: '',
      notification_type: 'No Notification',
      auto_approve: false,
      disable: false,
      expire_unit: 'Never',
      expire: false,
      rules: [],
      rule_action: '',
      rule_match: '',
      rule_trigger_when: '',
      url: '',
      assignment: 'Any',
      task: [],
      status: ''
    },
    subSubTaskTemplateSchemaDefault: {
      name: '',
      description: '',
      event: null,
      form: null,
      reference: null,
      survey: null,
      role: null,
      sub_role: null,
      type: 'Survey',
      notification_type: 'No Notification',
      auto_approve: false,
      disable: false,
      expire_unit: 'Never',
      expire: false,
      rules: [],
      rule_action: '',
      rule_match: '',
      rule_trigger_when: '',
      url: '',
      assignment: 'Any',
      task: [],
      status: ''
    },
    subSubTaskDialog: false,
    rulesSubTaskItems: [],
    subSubTaskItems: [],
    rulesHeaders: [
      { text: 'Entity', align: 'left', value: 'entity' },
      { text: 'Field', align: 'left', value: 'field' },
      { text: 'Condition', align: 'left', value: 'condition' },
      { text: 'Value', align: 'left', value: 'match_value' },
      { text: 'Action', align: 'center', value: 'name' }
    ],
    taskRuleSchema: {
      entity: '',
      field: '',
      condition: '',
      match_value: ''
    },
    taskRuleSchemaDefault: {
      entity: '',
      field: '',
      condition: '',
      match_value: ''
    },
    notificationType: ['No Notification', 'Notify Assigned Caseworker(s)', 'Notify Caseworker(s) and Message Group', 'Notify Message Group', 'Notify Caseworker(s) On Each Submission', 'Notify Assigned Caseworker(s) and Message Group'],
    // referenceTypeItems: ['Group of task', 'Document Upload', 'Event Signup', 'Form - Internal', 'Form - External', 'Data merge with/without signature', 'URL', 'Document Download', 'Survey', 'Reference', 'Payment'],
    referenceTypeItems: [],
    expire_unit: ['Hour', 'Day', 'Week', 'Month', 'Year', 'Never'],
    assignment: ['All', 'Any', 'One'],
    // taskTypes: ['PDF', 'TXT'],
    taskTypes: ['Group of task', 'Document Upload', 'Event Signup', 'Form - Internal', 'Form - External', 'Data merge with/without signature', 'URL', 'Document Download', 'Survey', 'Reference', 'Payment'],
    surveyItems: [],
    roleItems: [],
    subRoleItems: [],
    taskItems: [],
    subTaskItems: [],
    snack: false,
    snackColor: '',
    snackText: '',
    taskDialog: false,
    editedTaskIndex: -1,
    rulesItems: [],
    ruleDialog: false,
    editedRuleIndex: -1,
    entityItems: [],
    entityFieldsItems: [],
    rules: {
      required: value => !!value || 'Required.',
      // email: value => is.email(value) || 'Invalid e-mail.',
    },
    statusItems: [],
  }),
  computed: {
    taskFormTitle () {
      return this.editedTaskIndex === -1 ? 'New Task' : 'Edit Task';
    },
    subTaskFormTitle () {
      return this.editedTaskIndex === -1 ? 'New SubTask' : 'Edit SubTask';
    },
    rulesFormTitle () {
      return this.editedTaskIndex === -1 ? 'New Rule' : 'Edit Rule';
    },
    swagger () {
      return this.store.state.swagger;
    }
  },
  watch: {

  },
  created () {
    this.feedGrid('Role');
    this.feedGrid('TaskTemplate');
    this.feedGrid('Survey');
    this.feedGrid('TaskStatus');
  },
  mounted () {
    for (let entityName in this.swagger.definitions) {
      if (this.swagger.definitions.hasOwnProperty(entityName)) {
        this.entityItems.push(entityName);
        // console.log(columnName);
      }
    }
  },
  methods: {
    async feedGrid (entity) {
      let { data, total, error } = await getFromApi(entity, this);
      if (error) {
        console.log(error);
      } else {
        switch (entity) {
          case 'Role':
            this.roleItems = data;
            break;
          case 'TaskTemplate':
            this.taskItems = data;
            break;
          case 'Survey':
            this.surveyItems = data;
            break;
          case 'Reference':
            this.referenceTypeItems = data;
            break;
          case 'TaskStatus':
            this.statusItems = data;
            break;
        
          default:
            break;
        }
      }
    },
    async fillSubRole (e) {
      let where = { role: e };
      
      let { data, total, error } = await getFromApi('SubRole', this, where);
      if (error) {
        console.log(error);
      } else {
        this.subRoleItems = data;
      }
    },
    fillEntityField (e) {
      const entityDefinition = this.swagger.definitions[e];
      const entityProperties = entityDefinition.properties;

      for (let entityField in entityProperties) {
        if (entityProperties.hasOwnProperty(entityField)) {
          this.entityFieldsItems.push(entityField);
          // console.log(columnField);
        }
      }
    },
    editItem (item, e) {

      console.log('Edit >>>>>>>', e, item);
      switch (e) {
        case 'task':
          this.editedTaskIndex = this.taskItems.indexOf(item);
          this.taskTemplateSchema = Object.assign({}, item);
          this.rulesItems = this.taskTemplateSchema.rules;
          this.subTaskItems = this.taskTemplateSchema.task;
          this.taskDialog = true;
          break;

        case 'subTask':
          this.editedSubTaskIndex = this.subTaskItems.indexOf(item);
          this.subTaskTemplateSchema = Object.assign({}, item);
          this.rulesSubTaskItems = this.subTaskTemplateSchema.rules;
          this.subSubTaskItems = this.subTaskTemplateSchema.task;
          this.subTaskDialog = true;
          break;
        
        case 'rule':
          this.editedRuleIndex = this.rulesItems.indexOf(item);
          this.taskRuleSchema = Object.assign({}, item);
          this.ruleDialog = true;
          break;
  

        default:
          break;
      }
    },

    deleteItem (item, e) {
      let index = null;
      console.log('deleteItem', this.taskRuleSchema.sub_roles, item);
      switch (e) {
        case 'rule':
          index = this.rulesItems.indexOf(item);
          confirm('Are you sure you want to delete this item?') && this.rulesItems.splice(index, 1);
          break;

        default:
          break;
      }
      
    },
    close (item) {
      console.log('Close >>>>>>>', item);
      switch (item) {
        case 'task':
          this.taskDialog = false;
          this.rulesItems = [];
          this.subTaskItems = [];
          setTimeout(() => {
            this.taskTemplateSchema = Object.assign({}, this.taskTemplateSchemaDefault);
            this.editedTaskIndex = -1;
          }, 300);
          break;

        case 'subTask':
          this.subTaskDialog = false;
          this.rulesSubTaskItems = [];
          this.subSubTaskItems = [];
          setTimeout(() => {
            this.subTaskTemplateSchema = Object.assign({}, this.subTaskTemplateSchemaDefault);
            this.editedSubTaskIndex = -1;
          }, 300);
          break;

        case 'rule':
          this.ruleDialog = false;
          setTimeout(() => {
            this.taskRuleSchema = Object.assign({}, this.taskRuleSchemaDefault);
            this.editedRuleIndex = -1;
          }, 300);
          break;

        case 'ruleSub':
          this.ruleDialog = false;
          setTimeout(() => {
            this.taskRuleSchema = Object.assign({}, this.taskRuleSchemaDefault);
            this.editedRuleIndex = -1;
          }, 300);
          break;
  
        default:
          break;
      }

      if (this.editedRuleIndex > -1) this.RuleRoles = [];
    },

    save (item) {
      if (this.$refs[item].validate() === true) {
        switch (item) {
          case 'task':
            this.taskTemplateSchema.task = this.subTaskItems;
            console.log(item, this.taskTemplateSchema);
            if (this.editedTaskIndex > -1) {
              this.update(this.taskTemplateSchema);
            } else {
              this.create(this.taskTemplateSchema);
            }
            break;

          case 'subTask':
            for (let payloadField in this.subTaskTemplateSchema) {
              if (this.subTaskTemplateSchema.hasOwnProperty(payloadField)) {
                // console.log(payloadField);
                if (this.subTaskTemplateSchema[payloadField] === '' || this.subTaskTemplateSchema[payloadField] === null) {
                  delete this.subTaskTemplateSchema[payloadField]
                  continue
                }
              }
            }
            // this.taskTemplateSchema.task.push(this.subTaskTemplateSchema);
            if (this.editedSubTaskIndex > -1) {
              Object.assign(this.subTaskItems[this.editedSubTaskIndex], this.subTaskTemplateSchema);
            } else {
              this.subTaskItems.push(this.subTaskTemplateSchema);
            }
            this.close(item);
            console.log(item, this.taskTemplateSchema, this.subTaskTemplateSchema);
            break;

          case 'rule':
            console.log(item, this.taskRuleSchema, this.taskTemplateSchema);
            this.taskTemplateSchema.rules.push(this.taskRuleSchema);
            // this.taskTemplateSchema.has_Sub_Task = true;
            if (this.editedRuleIndex > -1) {
              Object.assign(this.rulesItems[this.editedRuleIndex], this.taskRuleSchema);
            } else {
              this.rulesItems.push(this.taskRuleSchema);
            }
            this.close(item);
            break;
        
          default:
            break;
        }
        
        // this.close(item);

      } else {
        Swal.fire(
          'Attention!',
          'All required fields must be completed.',
          'warning'
        );
        // this.$vuetify.goTo('#usersTop');
      }
    },
    async create (payload) {
      for (let payloadField in payload) {
        if (payload.hasOwnProperty(payloadField)) {
          // console.log(payloadField);
          if (payload[payloadField] === '' || payload[payloadField] === null) {
            delete payload[payloadField]
            continue
          }
        }
      }
      console.log('CREATE PAYLOAD >>', payload);
      let { data, total, error } = await create('TaskTemplate', payload);
      if (error) {
        console.log(error);
      } else {
        this.taskItems.push(data);
        console.log('CREATE >>', data);
        this.close('task');
      }
    },
    async update (payload) {

      console.log('UPDATE PAYLOAD >>', payload);
      let { data, total, error } = await update('TaskTemplate', payload, payload._id);
      if (error) {
        console.log(error);
      } else {
        // this.programItems.push(data);
        Object.assign(this.taskItems[this.editedTaskIndex], data);
        console.log('UPDATE >>', data);
        this.close('task');
      }
    },
    async delete (entity, id) {
      console.log('Delete >>>>>>>>> ', entity, id);
      let { error, data } = await remove(entity, id);
      if (error)
      {
        console.error('error on load', error);
        return { data, error };
      } 
      else
      {
        console.log(entity, 'Deleted successfully', data);
        this.feedItem('Program');
      }
    },
    fillField (collection, id, elementId) {
      window.setTimeout(() => {

        this._fillField(collection, id, elementId);
      }, 700);
    },

    async _fillField (collection, id, elementId) {
      // let { data, total, error } = await getOnLocalCollection(collection, id);
      // console.log('_fillField successfully', collection, id, elementId);
      if (id !== undefined) {
        let where = { _id: id };
      
        let { data, total, error } = await getOne(collection, id);
        if (error)
        {
          console.error('error get ' + collection, error);
          return { data, error };
        } 
        else
        {
          if (data) {
            document.getElementById(elementId).innerHTML = data.name;
          }
          else
          {
            document.getElementById(elementId).innerHTML = '';
          }
          
        }
      } 
      else
      {
        document.getElementById(elementId).innerHTML = '';
      }
      
    }
    
  }
};

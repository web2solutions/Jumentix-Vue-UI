import { Container, Draggable } from 'vue-smooth-dnd';
import { applyDrag, generateItems, generateTaskItems } from './utils/helpers';
import {
  update,
  showSnack
} from '../../../../helpers/helpers';

export default {
  name: 'xKanban',

  components: { Container, Draggable },
  props: {
    stages: {
      type: Array,
      required: true,
    },
    blocks: {
      type: Array,
      required: true,
    },
    bus: {
      type: Object,
      default: function () { return {} },
    }
  },
  data () {
    return {
      scene: {},
      upperDropPlaceholderOptions: {
        className: 'cards-drop-preview',
        animationDuration: '150',
        showOnTop: true
      },
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true
      }
    };
  },
  computed: {
    localBlocks () {
      return this.blocks;
    }
  },
  created () {
    // if (this.scene === null) this.getScene();
  },
  mounted () {
    // console.log('mounted', this.blocks, this.stages);
    if (!this.scene.hasOwnProperty('type')) this.getScene();
    
  },
  methods: {
    getScene () {
      console.log('getScene', this.scene, this.stages);
      this.scene = {
        type: 'container',
        props: {
          orientation: 'horizontal'
        },
        children: generateItems(this.stages.length, i => ({
          id: `column${i}`,
          type: 'container',
          name: this.stages[i].status,
          statusID: this.stages[i].id,
          props: {
            orientation: 'vertical',
            className: 'card-container'
          },
          children: generateItems(this.getBlocksLength(this.stages[i].status), j => ({
            type: 'draggable',
            id: `${i}${j}`,
            props: {
              className: 'card',
            },
            data: this.getBlocks(this.stages[i].status, j)
          }))
        }))
      };
    },
    getBlocks (status, j) {
      let tasks = this.localBlocks.filter(block => block.status === status);
      return tasks[j];
    },
    getBlocksLength (status) {
      return this.localBlocks.filter(block => block.status === status).length;
    },
    onColumnDrop (dropResult) {
      console.log('onColumnDrop', this.scene, dropResult);
      const scene = Object.assign({}, this.scene);
      scene.children = applyDrag(scene.children, dropResult);
      this.scene = scene;
    },

    onCardDrop (columnId, dropResult, statusID, statusName, taskID) {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        let payloadTaskID = dropResult.payload.data.id;
        console.log('PAYLOAD >>>>>>>>>>>>> ', columnId, dropResult.addedIndex, dropResult.removedIndex, dropResult.payload.data.id, ' - ', payloadTaskID, dropResult);
        console.log('column.children > taskID <<<<<<<<<<<<', taskID);
        if (statusID !== dropResult.payload.data.statusID && dropResult.payload.data.id !== undefined) {
          dropResult.payload.data.statusID = statusID;
          dropResult.payload.data.status = statusName;
          // dropResult.payload.data.id = taskID[dropResult.addedIndex].data.id;
          if (dropResult.removedIndex === null) {
            console.log('onCardDrop removedIndex === null', columnId, dropResult.addedIndex, dropResult.removedIndex, dropResult.payload.data.id, statusName, taskID);
          } else
          {
            console.log('onCardDrop removedIndex ELSE', columnId, dropResult.addedIndex, dropResult.removedIndex, dropResult.payload.data.id, statusName, taskID);
          }
          console.log('onCardDrop', columnId, dropResult.addedIndex, dropResult.removedIndex, dropResult.payload.data.id, statusName, taskID);
          this.onUpdateCard(dropResult.payload.data, statusID);
        } 
        else 
        {
          // dropResult.payload.data.statusID = statusID;
          // dropResult.payload.data.status = statusName;
          dropResult.payload.data.id = dropResult.payload.data.id;
          console.log('onCardDrop ELSE', columnId, dropResult.payload.data.id, taskID);
        }
        // console.log('onCardDrop ELSE >>>>>>>>>>>>> ', columnId, dropResult.payload.data.id);
        const scene = Object.assign({}, this.scene);
        const column = scene.children.filter(p => p.id === columnId)[0];
        const columnIndex = scene.children.indexOf(column);

        const newColumn = Object.assign({}, column);
        newColumn.children = applyDrag(newColumn.children, dropResult);
        scene.children.splice(columnIndex, 1, newColumn);

        this.scene = scene;
        // console.log('PAYLOAD >>>>>>>>>>>>> ', columnId, dropResult.addedIndex, dropResult.removedIndex);
        if (dropResult.addedIndex !== null) {
          // this.onSortCard(this.scene);
        }
      }
    },
    
    async onUpdateCard (task, statusID) {
      //
      console.log('onUpdateCard', task, statusID);
      task.status = statusID;
      if (task.id !== undefined) {
        let { data, total, error } = await update('Task', task, task.id);
        if (error)
        {
          console.error('error on update Task', error);
        }
        else
        {
          showSnack(this, false, 'Task ' + task.name + ' Status Updated successfully!');
        // this.bus.$emit('taskCreated', data);    
        }
      }
      
    },

    async onSortCard (scene) {
      //
      let tasks = [];
      let index = 0;
      scene.children.forEach(element => {   
        element.children.forEach(element => {
          index++;
          console.log('SortCard', index, element.data.name, element.data._id, element.data.id);
          tasks.push(element.data.id);
        });   
      });
      tasks = [...new Set(tasks)];
      console.log('SortCard >>>>>>>>>>>>>>>>', tasks);

      
    },


    getCardPayload (columnId) {
      return index => {
        return this.scene.children.filter(p => p.id === columnId)[0].children[index];
      };
    },

    dragStart () {
      // console.log('drag started');
    },

    log (...params) {
      // console.log(...params);
    }
  }
};

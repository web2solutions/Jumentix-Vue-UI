/* global session */
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
export default {
  name: 'TasksDetails',
  data: () => ({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    tab: 0,
    tabs: null,
    tabsContent: null,
    priorityItems: ['Urgent!', 'High Priority', 'Medium Priority', 'Normal Priority', 'Low Priority', 'Very Low Priority', 'Whatever'],
    contextTask: ['Work', 'Meeting', 'Documents', 'Internet', 'Phone'],
    date: new Date().toISOString().substr(0, 10),
    date_issue_pick: false,
    seasons: [
      '0%',
      '25%',
      '50%',
      '75%',
      '100%'
    ],
    content: 'Compose Task Description...',
    editorOption: {

    },
    items: [
      {
        action: 'perm_identity',
        title: 'Caseworks',
        active: true,
        items: [
          { title: 'Alivia Gerrits', check: false },
          { title: 'Barb Sheler', check: true },
          { title: 'case6 test1', check: false }
        ]
      },
      {
        action: 'people_outline',
        title: 'Groups',
        items: [
          { title: 'Accounting Team' },
          { title: 'Adoptive Family Network Bundle' },
          { title: 'Birth Mother - History' },
          { title: 'Domestic - Child' }
        ]
      },
      {
        action: 'folder_open',
        title: 'Adoption Associates',
        items: [
          { title: 'Adoption Associates' }
        ]
      }
    ],
    headers: [
      {
        text: 'ID',
        align: 'left',
        value: 'id',
        width: '10'
      },
      { text: 'Status', value: 'status', align: 'center', width: '10' },
      { text: 'Description', value: 'description' },
      { text: 'info', value: 'info', align: 'center', width: '30' }
    ],
    tasks: [
      {
        id: 1,
        status: 51,
        description: 'Consider delegating Vivek`s tasks',
        info: true,
      },
      {
        id: 2,
        status: 50,
        description: 'Consider delegating Vivek`s tasks',
        info: false,
      },
      {
        id: 3,
        status: 1,
        description: 'Consider delegating Vivek`s tasks',
        info: false,
      },
      {
        id: 4,
        status: 71,
        description: 'Consider delegating Vivek`s tasks',
        info: true,
      },
      {
        id: 5,
        status: 61,
        description: 'Consider delegating Vivek`s tasks',
        info: false,
      },
      {
        id: 6,
        status: 1,
        description: 'Consider delegating Vivek`s tasks',
        info: false,
      },
      {
        id: 7,
        status: 1,
        description: 'Consider delegating Vivek`s tasks',
        info: false,
      },
      {
        id: 8,
        status: 71,
        description: 'Consider delegating Vivek`s tasks',
        info: true,
      },
      {
        id: 9,
        status: 1,
        description: 'Consider delegating Vivek`s tasks',
        info: true,
      }
    ],
    dialog: false,
    headersComments: [
      {
        text: 'Comments',
        align: 'left',
        sortable: false,
        value: 'comments'
      },
      { text: 'By', value: 'by' },
      { text: 'Date', value: 'date' },
      { text: 'action', value: '', align: 'center', }
    ], 
    headersHistory: [
      {
        text: 'Date',
        align: 'left',
        sortable: false,
        value: 'date'
      },
      { text: 'User', value: 'user', align: 'left' },
      { text: 'action', value: 'action' }
    ],
    HistoryTasks: [
      {
        date: '2018/07/01',
        user: 'Adoptions Associates',
        action: '0%'
      },
      {
        date: '2018/07/07',
        user: 'Adoptions Associates',
        action: '50%'
      },
      {
        date: '2018/07/10',
        user: 'Adoptions Associates',
        action: '100%'
      }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      comments: '',
      by: '',
      date: ''
    },
    defaultItem: {
      comments: '',
      by: '',
      date: ''
    },
    CommentTasks: [
      {
        id: 1,
        comments: 'checked issues',
        by: 'Adoptions Associates',
        date: '2018/07/08',
      },
      {
        id: 2,
        comments: 'Open issues',
        by: 'Adoptions Associates',
        date: '2018/07/08',
      }
    ]
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Comment' : 'Edit Comment';
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
    dialog (val) {
      val || this.close();
    }
  },
  created () {
    // let self = this;
    this.tabs = [{ name: 'Application' }, { name: 'Home Study' }, { name: 'Profile Creation' }];
    this.tabsContent = ['Application', 'Home Study', 'Profile Creation'];
  },
  methods: {
    showAlert () {
      console.log(this.router, this.$router);
      // this.$router.push('/dashboard');
      this.router.push({
        path: `/dashboard`
      });
    },

    season (val) {
      return this.seasons[val];
    },
    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem (item) {
      const index = this.desserts.indexOf(item);
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1);
    },

    close () {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    }

  },
  components: {
    quillEditor
  }
};

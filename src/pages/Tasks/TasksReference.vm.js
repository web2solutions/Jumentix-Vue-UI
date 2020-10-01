/* global session */
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
export default {
  name: 'TasksReference',
  data: () => ({
    content: 'Description text...',
    editorOption: {

    },
    referenceType: ['Invoce Payment', 'Filling out a form', 'Document Upload', 'References', 'Signing Document'],
    contact: ['Work', 'Meeting'],
    chips: ['mark@web2solutions.com', 'case@work.com'],
   
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
  created () {
    // let self = this;
  },
  methods: {
    cloneCard () {
      let div = document.getElementById('cardItem');
      let clone = div.cloneNode(true); // true means clone all childNodes and all event handlers
      clone.id = 'some_id';
      document.getElementById('card').appendChild(clone);
    },
    closeCard (e) {
      console.log(e.path[6]); 
      let el = e.path[6];
      el.remove();
    },
    remove (item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    }

  },
  components: {
    quillEditor
  }
};

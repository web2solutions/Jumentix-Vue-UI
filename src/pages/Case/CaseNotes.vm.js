/* global session store $route moment */
import { getOne, getOnLocalCollection, getLocalCollection, update, remove } from '../../helpers/helpers';
import session from '../../helpers/session';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import swal from 'sweetalert2';
export default {
  name: 'CaseNotes',
  components: {
    VuePerfectScrollbar
  },
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    model: null,
    searchType: 'Name',
    isLoading: false,
    fab: false,
    advancedSearch: null,
    item_text: 'name',
    item_value: '_id',
    billiable: false,
    rangeSelect: false,
    dateStart: null,
    dateEnd: null,
    modalStart: null,
    modalEnd: null,
    modalStartDate: false,
    modalEndDate: false,
    modalDuration: false,
    typeModel: false,
    typeItems: null,
    typeSelect: false,
    typeSearch: '',
    authorModel: false,
    authorItems: null,
    authorSelect: false,
    authorSearch: '',
    incidentSelect: false,
    incidentSearch: '',
    prioritySelect: false,
    prioritySearch: '',
    items: [
      { title: 'Home', icon: 'dashboard' },
      { title: 'About', icon: 'question_answer' }
    ],
    dialog: false,
    search: '',
    itemsMenu: [
      { title: 'Name' },
      { title: 'Case Number' }
    ],
    incidentItems: ['Yes', 'No'],
    priorityItems: ['Low', 'Medium', 'High'],
    headers: [
      { text: '', value: '', align: 'center', sortable: false },
      { text: 'Type', value: 'type', align: 'center' },
      { text: 'Date', value: 'end_date', align: 'center' },
      { text: 'Author', value: 'author', align: 'center' },
      { text: 'Subject', value: 'subject', align: 'center' },
      { text: 'Tag', value: 'tag', align: 'center' },
      { text: 'Version', value: '', align: 'center' },
      { text: 'Action', value: '', align: 'center', sortable: false },
    ],
    caseItems: [],
    editedIndex: -1,
    editedItem: {
      subject: '',
      note: '',
      type: '',
      end_date: '',
      author: '',
      id: '',
      incident: '',
      priority: '',
      updatedAt: '',
    },
    defaultItem: {
      subject: '',
      note: '',
      type: '',
      author: '',
      end_date: '',
      id: '',
      incident: '',
      priority: '',
      updatedAt: '',
    }
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Case' : 'Edit Case';
    }
  },
  watch: {
    dialog (val) {
      val || this.close();
    }
  },
  created () {
    this.loading = true;
    // this.initialize();
    this.initialize();
    this.feedSelects('Human');
    this.feedSelects('CaseNoteType');
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
  methods: {
    async initialize () {
      let entity = 'CaseNote';
      let { data, total, error } = await getLocalCollection(entity);
      if (error) {
        console.log(error);
      } else {
        if (data.length >= 1) {
          this.caseItems = data;
          this.loading = false;
          for (const key in this.caseItems) {
            if (this.caseItems.hasOwnProperty(key)) {
              const element = this.caseItems[key];
              console.log(element, key);
              (async () => {
                let { error, data, status } = await getOnLocalCollection('Human', element.author);
                if (error) {
                  console.log('ERROR GET drawee_human: ', error);
                }
                else 
                {
                  element.author = data.name;
                  element.authorId = data.id;
                }
              })();
    
              (async () => {
                let { error, data, status } = await getOnLocalCollection('CaseNoteType', element.type);
                if (error) {
                  console.log('ERROR GET drawee_human: ', error);
                }
                else 
                {
                  element.type = data.type;
                  element.typeId = data.id;
                }
              })();
              if (element.duration) {
                element.duration = element.duration.hour + ':' + element.duration.minute;
              }
            }
          }
          
        }
        
      }
      
    // console.log('data', this.caseItems);
    },
    async feedSelects (entity) {
      let { data, total, error } = await getLocalCollection(entity, this);
      if (error) {
        console.log(error);
      } else {
        console.log(entity, data);
        switch (entity) {
          case 'CaseNoteType':
            this.typeItems = data;
            break;
          case 'Human':
            this.authorItems = data;
            break;
        
          default:
            break;
        }
        
      }
    },
    editItem (item) {
      this.editedIndex = this.caseItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      if (this.editedItem.endDate) this.editedItem.endDate = new Date(this.editedItem.endDate).toISOString().substr(0, 10);
      if (this.editedItem.startDate) this.editedItem.startDate = new Date(this.editedItem.startDate).toISOString().substr(0, 10);
      this.dialog = true;
    },
    deleteItem (item) {
      swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          (async () => {
            let { error, data, status } = await remove('CaseNote', item._id);
            if (error) {
              console.log('ERROR GET CaseNote: ', error);
            }
            else 
            {
              console.log('DELETE: ', data);
              const index = this.caseItems.indexOf(item);
              this.caseItems.splice(index, 1);
              swal.fire(
                'Deleted!',
                'Your CaseNote #' + data.subject + ' has been deleted.',
                'success'
              );
            }
          })();
        }
      });
      
    },
    close () {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    async save () {
      if (this.$refs.formEdit.validate() && this.editedIndex > -1) {
        // create
        if (this.editedItem.endDate) this.editedItem.endDate = new Date(this.editedItem.endDate).toISOString();
        if (this.editedItem.startDate) this.editedItem.startDate = new Date(this.editedItem.startDate).toISOString();

        if (this.editedItem.duration) {
          let duration = this.editedItem.duration.split(':');
          this.editedItem.duration = {
            'hour': Number(duration[0]),
            'minute': Number(duration[1]),
          };
        }
        else
        {
          delete this.editedItem.duration;
        }

        this.editedItem.author = this.editedItem.authorId;
        this.editedItem.type = this.editedItem.typeId;

        delete this.editedItem.typeId;
        delete this.editedItem.authorId;

        console.log('create (this.caseData)', this.editedItem);

        let { data, total, error } = await update('CaseNote', this.editedItem, this.editedItem.id);
        if (error) {
          console.log('CaseNote Create Error', error);
        } else {
          console.log('CaseNote Create', data);
          this.dialog = false;
          swal.fire({
            type: 'success',
            title: 'Casenote Updated successfully',
            showConfirmButton: false,
            timer: 2500,
            onClose: () => {
              this.initialize();
              this.feedSelects('Human');
              this.feedSelects('CaseNoteType');
            }
          });
        }
      }
      else
      {
        swal.fire({
          type: 'error',
          title: 'All fields must be filled',
          showConfirmButton: false,
          timer: 2500,
          onClose: () => {
            // this.advancedSearch = true;
          }
        });
      }
    },
    async saveold () {
      try {
        if (this.editedIndex > -1) {
          // update
          try {
            await this.update(this.editedItem, this.editedItem._id);
            Object.assign(this.caseItems[this.editedIndex], this.editedItem);
            console.log('UPDATE', this.editedItem);
            this.initialize();
            this.feedSelects('Human');
            this.feedSelects('CaseNoteType');
          } catch (e) {
            console.log('ERROR UPDATE', e);
          }
        } else {
        // create
          try {
            this.caseItems.push(this.editedItem);
            let response = this.create(this.editedItem);
            console.log('Response', response);
            this.initialize();
            this.feedSelects('Human');
            this.feedSelects('CaseNoteType');
          } catch (e) {
            // console.log('ERROR CREATE', e);
          }
        }
        this.close();
      } catch (e) {
        console.log(e);
        return Error(e);
      }
    },
    async update (payload, id) {
      try {
        payload.author = session.user().human.id;
        payload.end_date = new Date(payload.end_date).toISOString();
        let data = JSON.stringify(payload);
        delete data.id;
        delete data._id;
        let type = 'PUT';
        let url = `CaseNote/${id}`;
        let response = await session.http({ type, url, data });
        // console.log(response);
        return response;
      } catch (e) {
        console.log(e);
        return Error(e);
      }
    },
    selectFilter (item, i) {
      this.items = [];
      this.model = null;

      switch (item.title) {
        case 'Name':
          this.searchType = item.title;
          this.item_text = 'name';
          this.item_value = '_id';
          this.entity = 'Human';
          break;

        case 'Case Number':
          this.searchType = item.title;
          this.item_text = 'name';
          this.item_value = '_id';
          this.entity = 'Human';
          break;

        default:
          this.searchType = 'Name';
          break;
      }
      // console.log(this.searchType, this.items, this.items.length);
    },
    resetSearch () {

      this.billiable = false;
      this.rangeSelect = false;
      this.dateStart = null;
      this.dateEnd = null;
      this.modalStartDate = false;
      this.modalEndDate = false;
      this.modalEnd = false;
      this.modalDuration = false;
      this.modalDate = false;
      this.typeModel = false;
      this.typeItems = null;
      this.typeSelect = false;
      this.typeSearch = '';
      this.authorModel = false;
      this.authorItems = null;
      this.authorSelect = false;
      this.authorSearch = '';
      this.incidentSelect = false;
      this.incidentSearch = '';
      this.prioritySelect = false;
      this.prioritySearch = '';
    },
  }
};
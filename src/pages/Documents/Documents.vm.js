/* global session store $route */
import FileContainer from './FileContainer';
import swal from 'sweetalert2';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar,
    FileContainer
  },
  name: 'Documents',
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    selected: [],
    bottomNav: 'recent',
    search: '',
    btnDisabled: false,
    expandUpload: false,
    expandSearch: false,
    expandUploadInfo: false,
    expandDataTable: true,
    expandDataTableSearch: false,
    formData: null,
    filename: [],
    multiple: true,
    fileTypeItemsSelected: [],
    groupItems: [],
    groupItemsSelected: [],
    phaseItems: [],
    phaseItemsSelected: [],
    userItems: [],
    userItemsSelected: [],
    searchGroup: false,
    searchUser: false,
    headers: [
      {
        text: 'Document Name',
        align: 'left',
        value: 'document'
      },
      { text: 'Date', value: 'date', align: 'center' },
      { text: 'Type', value: 'type', align: 'center' },
      { text: 'Source', value: 'source', align: 'center' }
    ],
    headersSearch: [
      {
        text: 'Last Name',
        align: 'left',
        value: 'last_name'
      },
      { text: 'Case Number', value: 'caseNumber', align: 'center' },
      { text: 'Case Status', value: 'caseStatus', align: 'center' }
    ],
    documents: [
      {
        document: 'File Upload-Assessments-Home Study',
        date: '2018-03-30',
        type: 'doc',
        source: 'Agency'
      },
      {
        document: 'File Upload-Assessments-Home Document',
        date: '2018-03-30',
        type: 'PDF',
        source: 'Agency'
      },
      {
        document: 'File Upload-Assessments-Home Study Trainning',
        date: '2018-03-30',
        type: 'docx',
        source: 'Agency'
      },
      {
        document: 'File Upload-Assessments-Home Study Certific',
        date: '2018-03-30',
        type: 'PDF',
        source: 'Agency'
      },
      {
        document: 'File Upload-Assessments-Home Study Default',
        date: '2018-03-30',
        type: 'PDF',
        source: 'Agency'
      }
    ],
    documentsSearch: [
      {
        last_name: 'Flintston',
        caseNumber: '56363',
        caseStatus: 'Accept'
      },
      {
        last_name: 'Simpsons',
        caseNumber: '4563466',
        caseStatus: 'Reject'
      },
      {
        last_name: 'Andrade',
        caseNumber: '4563645',
        caseStatus: 'Pending'
      },
      {
        last_name: 'Almeida',
        caseNumber: '546456',
        caseStatus: 'On hold'
      },
      {
        last_name: 'Rubble',
        caseNumber: '546456',
        caseStatus: 'Pending'
      }
    ],
    fileTypeData: [
      { text: 'All', value: '0' },
      { text: 'General Document', value: '1' },
      { text: 'Financial', value: '2' },
      { text: 'Drivers License', value: '3' },
      { text: 'Birth Certificate', value: '4' },
      { text: 'General Document', value: '5' },
      { text: 'Financial', value: '6' }
    ],
    phaseData: [
      { text: 'All', value: '0' },
      { text: 'Home Study', value: '1' },
      { text: 'Other', value: '2' }
    ],
    userData: [
      { text: 'All', value: '0' },
      { text: 'Fred Flintston & Vilma', value: '1' },
      { text: 'Barney & Beth', value: '2' },
      { text: 'Homer & Marge', value: '3' }
    ],
    lastNameData: [
      { name: 'All', value: '0' },
      { name: 'Flintston', value: '1' },
      { name: 'Rubble', value: '2' },
      { name: 'Simpsons', value: '3' }
    ],
    caseNumberData: [
      { name: 'All', value: '0' },
      { name: '029201', value: '1' },
      { name: '929292', value: '2' },
      { name: '782972', value: '3' }
    ],
    caseStatusData: [
      { name: 'All', value: '0' },
      { name: 'Accept', value: '1' },
      { name: 'Pending', value: '2' },
      { name: 'Reject', value: '3' },
      { name: 'On hold', value: '4' }
    ]
  }),
  computed: {
    media () {
      return []; // => here you can map the media and send it to the container 
    },
    swagger () {
      return this.store.state.swagger;
    }

  },
  watch: {

  },
  created () {
    // let self = this;
  },
  mounted () {
    this.getDataFromApi('Group').then(data => {
      // data.items.forEach(doc => this.documents.push(doc));
      this.groupItems = data.items;
      // console.log(this.groupItems);
      // console.log('groupItems', this.groupItems);
    });
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
    session.swagger({
      success: response => {
        // console.log(response);
        store.commit('setSwagger', response);
        next();
      },
      error: (xhr, ajaxOptions, thrownError) => {
        console.log(thrownError);
        next();
      }
    });
  },
  methods: {
    onFileDeleted (fileId) {
      console.log(fileId); // => this fileId got deleted
    },
    onUploaded (payload) {
      // console.log(payload); // => here is the file information (either array or object of uploaded files
      this.mediaList = payload;

      // console.log(this.media, this.mediaList);
      this.expandUploadInfo = !this.expandUploadInfo;
    },
    downloadDoc (e) {
      // console.log('click', e, this.selected);
      if (this.selected.length !== 0) {
        swal.fire({
          title: 'DOWNLOAD',
          text: 'Are you sure you want to download the documents?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, download it!'
        }).then((result) => {
          if (result.value) {
            swal.fire(
              'Deleted!',
              'Your file (s) will be automatically downloaded.',
              'success'
            );
          }
        });

      } else {
        swal.fire(
          {
            title: 'DOWNLOAD',
            text: 'No documents selected.',
            type: 'error',
            buttons: false,
            dangerMode: true
          });
      }
    },

    deleteDoc (e) {
      if (this.selected.length !== 0) {
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
            swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
          }
        });
      } else {
        swal.fire(
          {
            title: 'DELETE',
            text: 'No documents selected.',
            type: 'error',
            buttons: false,
            dangerMode: true
          });
      }
    },
    searchDoc () {
      this.expandSearch = !this.expandSearch;
      this.expandDataTable = !this.expandDataTable;
      this.expandDataTableSearch = false;
    },
    onUploadBtn () {
      console.log(this.expandSearch);
      this.expandUpload = !this.expandUpload;
      this.expandDataTable = (this.expandSearch === true) ? !this.expandDataTable : this.expandDataTable;
      this.expandDataTable = !this.expandDataTable;
      this.btnDisabled = !this.btnDisabled;
      this.expandUploadInfo = false;
      this.expandSearch = false;
      this.forms = [];
      let input = document.getElementsByName('uploadfile')[0];
      input.value = '';
      this.expandDataTableSearch = false;
    },
    getDataFromApi (entity) {
      // console.log('entity', entity);
      this.loading = true;
      return new Promise(async (resolve, reject) => {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;

        const order = descending ? -1 : 1;
        const offset = page * rowsPerPage - rowsPerPage;
        let response = await session.http({
          url: `${entity}?limit=${rowsPerPage}&offset=${offset}&sort={"${sortBy}":${order}}`
          // url: `${entity}`
        });
        let items = response.data;
        const total = response.count;

        if (rowsPerPage > 0) {
          // items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        }
        // console.log('getDataFromApi', response);
        items = items.map(doc => {
          let newDoc = {};
          for (let prop in this.swagger.definitions[entity].properties) {
            if (this.swagger.definitions[entity].properties.hasOwnProperty(prop)) {
              let property = this.swagger.definitions[entity].properties[prop];
              if (property.type === 'string' || property.type === 'number') newDoc[prop] = doc[prop];
            }
          }
          
          return newDoc;
        });
        // console.log('items', items);
        this.loading = false;
        resolve({
          items,
          total
        });
      });
    },
    openSelect () {
      // console.log(this.$refs);
      this.expandDataTableSearch = true;
    },
    onRadioChange (e) {
      this.expandDataTableSearch = false;
      if (e === 'group') {
        this.searchGroup = true;
        this.searchUser = false;
      } else {
        this.searchUser = true;
        this.searchGroup = false;
      }
    }
  }
};

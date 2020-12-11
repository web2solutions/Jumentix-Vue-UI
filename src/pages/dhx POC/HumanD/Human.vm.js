/* global session store $route dhtmlXGridObject */
import fromCDN from 'from-cdn';
export default {
  data: () => ({
    mygrid: null,
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 15, // -1 for All
      totalItems: 0
    },
    loading: true,
    selected: [],
    dialog: false,
    expand: false,
    snack: false,
    snackColor: '',
    snackText: '',
    search: '',
    entity: 'Human',
    headers: [],
    original_documents: [],
    documents: [],
    editedIndex: -1,
    editedItem: {
      // _id: '',
      // first_name: '',
      // last_name: '',
      // email: ''
    },
    newItem: {
      // _id: '',
      // first_name: '',
      // last_name: '',
      // email: ''
    },
    defaultItem: {
      // _id: '',
      // first_name: '',
      // last_name: '',
      // email: ''
    }
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1
        ? 'New ' + this.entity
        : 'Edit ' + this.entity;
    },
    swagger () {
      return this.store.state.swagger;
    },
    pages () {
      let pages = 0;
      if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null)
      {
        pages = 0;
      }
      else
      {
        pages = Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
      }
      return pages;
    }
  },
  created () {
    this.ready = fromCDN([
      '//cdn.dhtmlx.com/5.1/dhtmlx.js',
      '//cdn.dhtmlx.com/5.1/dhtmlx.css'
    ]);
  },
  mounted () {
    for (let prop in this.swagger.definitions[this.entity].properties) {
      if (
        this.swagger.definitions[this.entity].properties.hasOwnProperty(prop)
      ) {
        let property = this.swagger.definitions[this.entity].properties[prop];

        if (property.type === 'string' || property.type === 'number') {
          let settings = {
            text: this.swagger.definitions[this.entity].properties[prop]
              .description,
            align: 'left',
            sortable: true,
            value: prop
          };
          this.editedItem[prop] = '';
          this.newItem[prop] = '';
          this.defaultItem[prop] = '';

          if (prop === '_id') {
            settings.width = '10px';
          }

          this.headers.push(settings);
        }
      }
    }
    let self = this;
    /** window.addEventListener('resize', function () {
      setTimeout(() => {
        self.buildGrid();
        self.mygrid.parse({ data: self.documents.map(d => { d.id = d._id; return d }) }, 'js');
      }, 200);
    }); */

    this.ready.then(() => {


      this.buildGrid();


      this.getDataFromApi().then(data => {
        this.documents = data.items;
        this.original_documents = [];
        // data.items.forEach(doc => this.documents.push(doc));
        data.items.forEach(doc => this.original_documents.push(doc));
        this.pagination.totalItems = data.total;
      });
    });
  },
  beforeRouteLeave (to, from, next) {
    this.mygrid.destructor();
    next();
  },
  beforeRouteEnter (to, from, next) {
    session.swagger({
      success: response => {
        console.log(response);
        store.commit('setSwagger', response);
        next();
      },
      error: (xhr, ajaxOptions, thrownError) => {
        console.log(thrownError);
        next();
      }
    });
  },
  //
  watch: {
    pagination: {
      handler () {
        console.log('watch pagination', this.pagination);
        this.getDataFromApi().then(data => {
          this.documents = data.items;
          this.original_documents = [];
          // data.items.forEach(doc => this.documents.push(doc));
          data.items.forEach(doc => this.original_documents.push(doc));
          this.pagination.totalItems = data.total;

        });
      },
      deep: true
    },
    documents: {
      handler () {
        console.log('watch documents', this.documents);
        this.mygrid.clearAll();
        this.mygrid.parse({ data: this.documents.map(d => { d.id = d._id; return d }) }, 'js');
      },
      deep: true
    },
    loading: {
      handler () {
        console.log('watch this.loading', this.loading);
      },
      deep: true
    },
    dialog (val) {
      val || this.close();
    }
  },
  methods: {
    getDataFromApi () {
      this.loading = true;
      return new Promise(async (resolve, reject) => {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        console.log(sortBy, descending);
        console.log(page, rowsPerPage);
        const order = descending ? -1 : 1;
        const offset = page * rowsPerPage - rowsPerPage;
        let response = await session.http({
          url: `${this.entity}?limit=${rowsPerPage}&offset=${offset}&sort={'${sortBy}':${order}}`
        });
        let items = response.data;
        const total = response.count;

        if (rowsPerPage > 0) {
          // items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        }

        items = items.map(doc => {
          let newDoc = {};
          for (let prop in this.swagger.definitions[this.entity].properties) {
            if (this.swagger.definitions[this.entity].properties.hasOwnProperty(prop)) {
              let property = this.swagger.definitions[this.entity].properties[prop];
              if (property.type === 'string' || property.type === 'number') newDoc[prop] = doc[prop];
            }
          }
          return newDoc;
        });

        this.loading = false;
        resolve({
          items,
          total
        });
      });
    },
    buildGrid () {
      if (this.mygrid)
      {
        this.mygrid.destructor();
      }
      const Grid = dhtmlXGridObject;
      this.mygrid = new Grid(this.$refs.container);
      this.mygrid.setImagesPath('//cdn.dhtmlx.com/5.1/imgs/');

      let headersTitle = [];
      let headers = [];
      let colWidths = [];
      let colAligns = [];
      let colTypes = [];
      let colSorting = [];
      let colIds = [];

      for (let property in this.swagger.definitions[this.entity].properties) {
        if (this.swagger.definitions[this.entity].properties.hasOwnProperty(property)) {
          let title = this.swagger.definitions[this.entity].properties[property]['x-label'] || this.swagger.definitions[this.entity].properties[property].description;
          let type = this.swagger.definitions[this.entity].properties[property].type;
          let hide = false;


          if (type === 'string' || type === 'number' || type === 'integer') {
            hide = false;
          } else {
            hide = true;
          }
          if (this.swagger.definitions[this.entity].properties[property]['x-grid-hide']) {
            hide = true;
          }


          console.log(property);
          console.log(this.swagger.definitions[this.entity].properties[property]);
          colIds.push(property);
          headersTitle.push(title);
          colWidths.push(hide ? 0 : '*');
          colAligns.push('left');
          colTypes.push('ro');
          colSorting.push(type === 'string' ? 'str' : 'int');
          headers.push('#text_search'); // #text_search,#select_filter
        }
      }

      this.mygrid.setHeader(headersTitle.join(','), ',', []);
      this.mygrid.setColumnIds(colIds.join(','));
      this.mygrid.setInitWidths(colWidths.join(','));
      this.mygrid.setColAlign(colAligns.join(','));
      this.mygrid.setColTypes(colTypes.join(','));
      this.mygrid.setColSorting(colSorting.join(','));
      // this.mygrid.attachHeader(headers.join(','));
      this.mygrid.enableAutoHeight(true);
      this.mygrid.enableAutoWidth(true);
      this.mygrid.init();
    },
    async getOne (id) {
      try {
        let response = await session.http({ url: this.entity + `/${id}` });
        this.feedGrid(response.data);
        // console.log(response.data);
        return response;
      } catch (e) {
        console.log(e);
        return Error(e);
      }
    },
    async create (payload) {
      try {
        let data = JSON.stringify(payload);
        delete data.id;
        delete data._id;
        let type = 'POST';
        let url = this.entity;
        let response = await session.http({ type, url, data });
        // console.log(response.data);
        return response;
      } catch (e) {
        console.log(e);
        return Error(e);
      }
    },
    async update (payload, id) {
      try {
        let data = JSON.stringify(payload);
        delete data.id;
        delete data._id;
        let type = 'PUT';
        let url = this.entity + `/${id}`;
        let response = await session.http({ type, url, data });
        // console.log(response);
        return response;
      } catch (e) {
        console.log(e);
        return Error(e);
      }
    },
    async delete (id) {
      try {
        let type = 'DELETE';
        let url = this.entity + `/${id}`;
        let response = await session.http({ type, url });
        console.log(response);
        // return response;
      } catch (e) {
        console.log(e);
        return Error(e);
      }
    },
    editItem (item) {
      this.editedIndex = this.documents.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem (item) {
      (async () => {
        if (confirm('Are you sure you want to delete this item?')) {
          try {
            let doc = await this.delete(item._id);
            console.log('DELETE', item._id);
            // const index = this.documents.indexOf(item);
            // this.documents.splice(index, 1);
            console.log(doc);
            this.getDataFromApi().then(data => {
              this.documents = data.items;
              this.original_documents = [];
              // data.items.forEach(doc => this.documents.push(doc));
              data.items.forEach(doc => this.original_documents.push(doc));
              this.pagination.totalItems = data.total;
            });
            return doc;
          } catch (e) {
            console.log('ERROR DELETE', e);
            return Error(e);
          }
        }
      })();
    },
    close () {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    async save () {
      if (this.editedIndex > -1) {
        // update
        try {
          await this.update(this.editedItem, this.editedItem._id);
          Object.assign(this.documents[this.editedIndex], this.editedItem);
          console.log('UPDATE', this.editedItem);
        } catch (e) {
          console.log('ERROR UPDATE', e);
        }
      } else {
        // create
        try {
          let response = await this.create(this.editedItem);
          let newDocument = {};
          for (let prop in this.swagger.definitions[this.entity].properties)
          {
            if (this.swagger.definitions[this.entity].properties.hasOwnProperty(prop))
            {
              let property = this.swagger.definitions[this.entity].properties[prop];
              if (property.type === 'string' || property.type === 'number')
              {
                newDocument[prop] = response.data[prop];
              }
            }
          }
          this.documents.push(newDocument);
          // console.log('CREATE', this.editedItem);
        } catch (e) {
          // console.log('ERROR CREATE', e);
        }
      }
      this.close();
      this.snack = true;
      this.snackColor = 'info';
      this.snackText = 'Data saved';
    }
  }
};

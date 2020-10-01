/* global session store */
export default {
  data: () => ({
    pagination: {
      sortBy: 'name'
    },
    selected: [],
    dialog: false,
    expand: false,
    snack: false,
    snackColor: '',
    snackText: '',
    search: '',
    entity: 'Group',
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
      return this.editedIndex === -1 ? 'New ' + this.entity : 'Edit ' + this.entity;
    },
    swagger () {
      return this.store.state.swagger;
    },
  },
  watch: {
    dialog (val) {
      val || this.close();
    }
  },
  created () {
    this.getAll();
  },
  mounted () {
    // console.log('MOUNTED');
    // console.log(this.swagger.definitions[this.entity].properties);
    // console.log(Object.keys(this.swagger.definitions[this.entity].properties));
    for (let prop in this.swagger.definitions[this.entity].properties)
    {
      if (this.swagger.definitions[this.entity].properties.hasOwnProperty(prop))
      {
        let property = this.swagger.definitions[this.entity].properties[prop];

        if (property.type === 'string' || property.type === 'number')
        {

          // console.log(prop, property);

          let settings = {
            text: (prop.charAt(0).toUpperCase() + prop.slice(1)).replace(/\_/g, ' '),
            align: 'left',
            sortable: true,
            value: prop
          };
          this.editedItem[prop] = '';
          this.newItem[prop] = '';
          this.defaultItem[prop] = '';

          if (prop === '_id')
          {
            settings.width = '10px';
          }
          this.headers.push(settings);
        }
      }
    }
    // console.log(this.headers);
  },
  beforeRouteEnter (to, from, next) {
    // console.log('beforeRouteEnter beforeRouteEnter beforeRouteEnter');
    // console.log(store);
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
      success: (response) => {
        console.log(response);
        store.commit('setSwagger', response);
        next();
      },
      error: (xhr, ajaxOptions, thrownError) => {
        console.log(thrownError);
      }
    });
  },
  methods: {
    feedGrid (documents) {
      documents.forEach(doc => {
        let newDoc = {};
        for (let prop in this.swagger.definitions[this.entity].properties)
        {
          if (this.swagger.definitions[this.entity].properties.hasOwnProperty(prop))
          {
            let property = this.swagger.definitions[this.entity].properties[prop];
            if (property.type === 'string' || property.type === 'number') newDoc[prop] = doc[prop];

          }
        }
        // console.log(JSON.parse(JSON.stringify(newDoc)));
        this.documents.push(JSON.parse(JSON.stringify(newDoc)));
        this.original_documents.push(JSON.parse(JSON.stringify(doc)));
      });
      this.snack = true;
      this.snackColor = 'light-green lighten-1';
      this.snackText = 'Listing is done';
    },
    async getAll () {
      try {
        let response = await session.http({ url: this.entity });
        this.feedGrid(response.data);
        // console.log(response.data);
        return response;
      }
      catch (e) {
        console.log(e);
        return Error(e);
      }
    },
    async getOne (id) {
      try {
        let response = await session.http({ url: this.entity + `/${id}` });
        this.feedGrid(response.data);
        // console.log(response.data);
        return response;
      }
      catch (e) {
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
      }
      catch (e) {
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
      }
      catch (e) {
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
      }
      catch (e) {
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
      const index = this.documents.indexOf(item);
      confirm('Are you sure you want to delete this item?') &&
        this.documents.splice(index, 1);
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
    },
    log: function (e) {
      // console.log(e.currentTarget);
      console.log(e);
    },
    toggleAll () {
      if (this.selected.length)
      {
        this.selected = [];
      }
      else
      {
        this.selected = this.documents.slice();
      }
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    }
  }
};

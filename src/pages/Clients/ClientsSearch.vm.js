/* global session store $route */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import session from '../../helpers/session';
export default {
  components: {
    VuePerfectScrollbar
  },
  data () {

    return {
      pagination: {
        sortBy: '_id',
        descending: true,
        page: 1,
        rowsPerPage: 100, // -1 for All
        totalItems: 0
      },
      autoUpdate: true,
      programItemsSelected: [],
      groupItemsSelected: [],
      caseItemsSelected: [],
      assignedItemsSelected: [],
      entity: 'Human',
      humanItems: [],
      programItems: [],
      groupItems: [],
      form_fields: [],
      assingData: [
        { text: 'Assigned to Me', value: '0' },
        { text: 'Alivia Gerrits', value: '1' },
        { text: 'Barb Sheler', value: '2' },
        { text: 'Casews6 Test1', value: '3' },
        { text: 'Christy Stevens', value: '4' },
        { text: 'cw24 test', value: '5' },
        { text: 'Ellen Tuinstra', value: '6' },
        { text: 'Ethiopia Team', value: '7' },
        { text: 'fs caseworker', value: '8' },
        { text: 'Ghana Team', value: '9' },
        { text: 'Heidi Cole, LMSW', value: '10' },
        { text: 'IT Support', value: '11' },
        { text: 'Janine Hammond', value: '12' },
        { text: 'Jeanette Warnshuis', value: '13' },
        { text: 'Jennifer Jaworski, LBSW', value: '14' },
        { text: 'Kris Burow', value: '15' },
        { text: 'Kris Dickens', value: '16' },
        { text: 'Laura Bussa', value: '17' },
        { text: 'Media9CW Test', value: '18' }
      ],
      caseData: [
        { text: 'All', value: '0' },
        { text: 'Adoption - Active', value: '1' },
        { text: 'Adoption - Closed', value: '2' },
        { text: 'Adoption - Discution', value: '3' },
        { text: 'Adoption - Disruption', value: '4' },
        { text: 'Adoption - Finalized', value: '5' },
        { text: 'Adoption - HSU 1', value: '6' },
        { text: 'Adoption - HSU 2', value: '7' },
        { text: 'Adoption - Linked', value: '8' }
      ]
    };
  },
  computed: {
    swagger () {
      return this.store.state.swagger;
    }
  },
  created () {
    // this.getAll();
  },
  mounted () {
    // setGriHeaders(this);
    // setFormFields(this);
    for (let prop in this.swagger.definitions[this.entity].properties) {
      if (
        this.swagger.definitions[this.entity].properties.hasOwnProperty(prop)
      ) {
        let property = this.swagger.definitions[this.entity].properties[prop];
        if (property.type === 'string' || property.type === 'number') {
          let settings = {
            text: this.swagger.definitions[this.entity].properties[prop]['x-label'] || this.swagger.definitions[this.entity].properties[prop]
              .description,
            value: prop
          };
          if (!this.swagger.definitions[this.entity].properties[prop]['x-grid-hide'] && prop !== 'photo' && prop !== '_id') {
            this.form_fields.push(settings);
          }

        }
      }
    }
    // console.log('form_fields:', this.form_fields);
    
    this.getDataFromApi('Program').then(data => {
      // data.items.forEach(doc => this.documents.push(doc));
      this.programItems = data.items;
      // console.log('programItems', data.items);
    });
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
    removeProgram (item) {
      const index = this.programItemsSelected.indexOf(item.name);
      if (index >= 0) this.programItemsSelected.splice(index, 1);
    },
    removeGroup (item) {
      const index = this.groupItemsSelected.indexOf(item.name);
      if (index >= 0) this.groupItemsSelected.splice(index, 1);
    },
    removeCase (item) {
      const index = this.caseItemsSelected.indexOf(item.text);
      if (index >= 0) this.caseItemsSelected.splice(index, 1);
    },
    removeAssigned (item) {
      const index = this.assignedItemsSelected.indexOf(item.text);
      if (index >= 0) this.assignedItemsSelected.splice(index, 1);
    },
    getDataFromApi (entity) {
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
        // console.log('entity: ', entity, 'items: ', items);
        this.loading = false;
        resolve({
          items,
          total
        });
      });
    }
  }
};
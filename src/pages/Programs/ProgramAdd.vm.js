/* global session */
import { getLocalCollection, getFromApi, getCollection } from '../../helpers/helpers';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Swal from 'sweetalert2/dist/sweetalert2.js';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'ProgramAdd',
  data: () => ({
    step: 0,
    rules: {
      required: value => !!value || 'Required.',
    },
    program: {
      name: null,
      role: [],
      group: [],
      file: []
    },
    programDefault: {
      name: null,
      role: [],
      group: [],
      file: []
    },
    programType: [
      {
        name: 'Adoptive Parent',
        subType: ['Adoptive Mother']
      },
      {
        name: 'Caseworker',
        subType: ['Adoptive Parent Caseworker']
      },
      {
        name: 'Hospital',
        subType: ['BirthParent Delivery']
      }
    ],
    programTypeSelected: null,
    programSubType: [],
    programSubTypeSelected: null,
    dialog: false,
    dialogGroup: false,
    dialogTitle: '',
    editItem: '',
    newForm: {
      name: '',
      type: ''
    },
    newFormDefault: {
      name: '',
      type: ''
    },
    groupItems: [],
    groupTypeItems: [],
    groupSelected: null,
    defaultGroup: true,
    humanItems: [],
    humanSelected: [],
    breweries: [],
    isLoading: false,
    tree: [],
    types: [],
    itemsRoles: [
      {
        id: 1,
        name: 'Client',
        children: [
          {
            id: 10, name: 'Adoptive Parent', 
            children: [
              { id: 11, name: 'Adoptive Mother' },
              { id: 12, name: 'Adoptive Father' },
              { id: 13, name: 'Adoptive Grand Mother' },  
            ]
          },
          {
            id: 20, name: 'Birth Parent', 
            children: [
              { id: 21, name: 'Birth Mother' },
              { id: 22, name: 'Birth Father' },
              { id: 23, name: 'Birth Grand Mother' },  
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Worker',
        children: [
          {
            id: 30, name: 'Caseworker', 
            children: [
              { id: 31, name: 'Adoptive Parente Caseworker' },
              { id: 32, name: 'Birth Parent Caseworker' },
            ]
          },
          {
            id: 40, name: 'Staff', 
            children: [
              { id: 41, name: 'System Admin' },
              { id: 42, name: 'Manager' },
              { id: 43, name: 'Editor' },  
            ]
          }
        ]
      },
      {
        id: 5,
        name: 'Business',
        children: [
          {
            id: 50, name: 'Hospital', 
            children: [
              { id: 51, name: 'Birth Parent Delivery' },
              { id: 52, name: 'Doctor' },
            ]
          },
          {
            id: 60, name: 'Staff', 
            children: [
              { id: 61, name: 'System Admin' },
              { id: 26, name: 'Manager' },
              { id: 63, name: 'Editor' },  
            ]
          }
        ]
      },
    ]

  }),
  computed: {
    itemsRolesoff () {
      const children = this.types.map(type => ({
        id: type,
        name: this.getName(type),
        children: this.getChildren(type)
      }));

      return [{
        id: 1,
        name: 'All Breweries',
        children
      }];
    },
    selections () {
      const selections = [];

      for (const leaf of this.tree) {
        const brewery = this.breweries.find(brewery => brewery.id === leaf);

        if (!brewery) continue;

        selections.push(brewery);
      }

      return selections;
    },
    shouldShowTree () {
      return this.breweries.length > 0 && !this.isLoading;
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
    programTypeSelected (e) {
      this.programSubType = [];
      if (e !== undefined) this.programSubType.push(e.subType);
    },

    breweries (val) {
      this.types = val.reduce((acc, cur) => {
        const type = cur.brewery_type;

        if (!acc.includes(type)) acc.push(type);

        console.log('breweries >>>>>>', val, type, acc);
        return acc;
      }, []).sort();
    },

    items (e) {
      console.log('iutems >>>>>>', e);
    }


  },
  created () {
    // let self = this;
    this.feedSelects('Group');
    console.log('created');
  },
  methods: {
    async feedSelects (entity) {
      let { data, total, error } = await getCollection(entity, 1000);
      if (error) {
        console.log(error);
      } else {
        switch (entity) {
          case 'Group':
            this.groupItems = data;
            break;
          case 'GroupRole':
            this.groupTypeItems = data;
            break;
          case 'Human':
            this.humanItems = data;
            break;
        
          default:
            break;
        }
        console.log('feedSelects', entity, data, this.groupItems);
      }
    },
    addNew (e) {
      this.editItem = e;
      switch (e) {
        case 'programType':
          this.dialogTitle = 'Program Type';
          this.dialog = true;
          break;
        case 'programSubType':
          this.dialogTitle = 'Program Sub Type';
          this.dialog = true;
          break;
        case 'Group':
          this.feedSelects('Human');
          this.feedSelects('GroupRole');
          this.dialogTitle = 'Group';
          this.dialogGroup = true;
          break;
      
        default:
          break;
      }
    },
    saveNew (e) {
      // this.programType = [];
      switch (e) {
        case 'programType':
          // let item = { name: this.newForm.name, subType: 'Adoption ' + this.newForm.name };
          this.programType.push({ name: this.newForm.name, subType: 'Adoption ' + this.newForm.name });
          this.programTypeSelected = { name: this.newForm.name, subType: 'Adoption ' + this.newForm.name };
          break;
        case 'programSubType':
          this.programSubType.push(this.newForm.name);
          this.programSubTypeSelected = this.newForm.name;
          break;

        case 'Group':
          this.groupItems.push({ name: this.newForm.name });
          this.groupSelected = { name: this.newForm.name };
          this.dialogGroup = false;
          break;
      
        default:
          break;
      }

      Swal.fire(
        'Success!',
        this.dialogTitle + ' Successfully created.',
        'success'
      );
     
      this.dialog = false;
      this.newForm = Object.assign({}, this.newFormDefault);
    },
    createProgram ()
    {
      Swal.fire(
        'Success!',
        'Program Successfully created.',
        'success'
      );
      this.program = Object.assign({}, this.programDefault);
      this.programTypeSelected = null;
      this.programSubTypeSelected = null;
      this.groupSelected = null;
      this.humanSelected = [];
      this.step = 1;
    },


    fetch () {
      if (this.breweries.length) return;

      return fetch('https://api.openbrewerydb.org/breweries')
        .then(res => res.json())
        // eslint-disable-next-line no-return-assign
        .then(data => (this.breweries = data))
        .catch(err => console.log(err));
    },
    getChildren (type) {
      const breweries = [];

      for (const brewery of this.breweries) {
        if (brewery.brewery_type !== type) continue;

        breweries.push({
          ...brewery,
          name: this.getName(brewery.name)
        });
      }

      return breweries.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
    },
    getName (name) {
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    }
  }
};

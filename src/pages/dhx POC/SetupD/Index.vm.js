/* global session store $route dhtmlXGridObject */
import * as dhx from 'dhtmlx/suite';

export default {
  data: () => ({
    mygrid: null,
    documents: [
      { id: 1, step: 'Setup Agency', status: 1 },
      { id: 2, step: 'Setup Roles configuration', status: 1 },
      { id: 3, step: 'Setup outside Organizations configuration', status: 0 },
      { id: 4, step: 'Setup Users configuration', status: 0 },
      { id: 5, step: 'Setup TaskStatus configuration', status: 0 },
      { id: 6, step: 'Setup Program configuration', status: 0 },
      { id: 7, step: 'Setup Group configuration', status: 0 },
      { id: 8, step: 'Setup Events configuration', status: 0 },
      { id: 9, step: 'Setup Reference configuration', status: 0 },
      { id: 10, step: 'Setup Finance configuration', status: 0 },
      { id: 11, step: 'Setup Portal configuration', status: 0 },
      { id: 12, step: 'Setup Entity Permissions configuration', status: 0 }
    ],
  }),
  mounted () {
    let self = this;
    this.buildGrid();
    window.addEventListener('resize', (e) => {
      self.mygrid.paint();
      console.log('xxxxxxxxxxx');
    });
  },
  beforeRouteLeave (to, from, next) {
    this.mygrid.destructor();
    next();
  },
  methods: {
    buildGrid () {
      this.mygrid = new dhx.Grid(this.$refs.container, {
        columns: [
          { 
            id: 'step', 
            header: [{ text: 'Step', content: 'inputFilter' }], 
            // footer: [{ text: 'Step', content: 'inputFilter' }],
            editable: true
          },
          { 
            width: 100, 
            id: 'status', 
            header: [{ text: 'Status' }] 
          },
        ],
        selection: 'complex',
        // htmlEnable: true, 
        // multiselection:true,  
        // adjust: 'header',
        // width: 400,   
        // height: 400,
        autoWidth: true, 
        headerRowHeight: 50,
        data: this.documents
      });
    }
  }
};

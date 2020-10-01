
export default {
  name: 'xCrudControls',
  props: [
    'entity',
    'bus',
    'displayWhat',
    'currentFormMode',
    'editID'
  ],
  data: () => ({
    search: '',
    steps: [
      {
        target: '#xadd',  // We're using document.querySelector() under the hood
        content: `Click on this button to <strong>add</strong> an item!`
      },
      {
        target: '#xsoftdelete',
        content: `Click on this button to <strong>delete</strong> an item! <br> 
          Deleted items can be restored by Admin and Agency users.`
      },
      {
        target: '#xrestore',
        content: `Click on this button to <strong>restore</strong> an item! <br> 
       Only Admin and Agency users can restore an deleted item.`
      },
      {
        target: '#xrefresh',
        content: `You can click on this button to refresh the entire data listing on any time.`,
        params: {
          placement: 'top'
        }
      },
      {
        target: '#xharddelete',
        content: `Click on this button to <strong>hard delete</strong> an item! <br> 
        Deleted items can not ne restored. Only Admins and Agency users can do hard delete!`
      },
      {
        target: '#xtextsearchfield',
        content: `This field is for textual searches. <br> Type the exact setences which you want to search for. 
        Only documents <strong>matching the exact setence</strong> will be returned!`
      },
      {
        target: '#xsearch',
        content: `Click on this button to execute the <strong>textual search</strong>.`
      },
      {
        target: '#xadvancedsearch',
        content: `Clicking on this button you will be able to perform an advanced search with <br> 
        several different options than textual searching.`
      },
      {
        target: '#xexportpdf',
        content: `Click on this button to <strong>export to pdf</strong> the entire listing.`
      },
      {
        target: '#xexportexcel',
        content: `Click on this button to <strong>export to excel</strong> the entire listing.`
      }
    ],
    tourCallbacks: {
      onPreviousStep: this.previousStepCallback,
      onNextStep: this.nextStepCallback
    },
  }),
  mounted () {
    // this.$tours['buttonsTour'].start();
  },
  methods: {
    doTextSearch () {
      this.bus.$emit('doTextSearch', this.search);
    },
    export2PDF () {
      this.bus.$emit('export2PDF');
    },
    export2Excel () {
      this.bus.$emit('export2Excel');
    },
    setDialogSearch () {
      this.bus.$emit('setDialogSearch');
    },
  }
};

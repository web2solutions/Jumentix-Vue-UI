<template>
<div>
 <v-toolbar card color="white" v-if="displayWhat === 'grid' || displayWhat === 'crud'">
    <v-tooltip top v-if="displayWhat === 'grid'">
      <v-btn id="xadd" fab dark color="green" @click="bus.$emit('createItem')" slot="activator">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Add {{entity}}</span>
    </v-tooltip>
    <v-tooltip top v-else>
      <v-btn id="xback" fab dark color="blue" v-if="$route.params.action === 'edit'" @click="bus.$emit('closeEdit', editID)" slot="activator">
        <v-icon>keyboard_arrow_left</v-icon>
      </v-btn>
      <v-btn id="xback" fab dark color="blue" v-else @click="bus.$emit('displayWhat', 'grid')" slot="activator">
        <v-icon>keyboard_arrow_left</v-icon>
      </v-btn>
      <span>Back to listing</span>
    </v-tooltip>
    <!-- soft delete -->
    <v-tooltip top v-if="displayWhat === 'grid'">
      <v-btn id="xsoftdelete"
        class="white--text" 
        fab 
        small 
        color="red" 
        slot="activator"
        @click="bus.$emit('deleteItem')"
      >
        <v-icon>delete</v-icon>
      </v-btn>
      <span>Soft Delete selected {{entity}}</span>
    </v-tooltip>
    <v-tooltip 
    top
    v-if="displayWhat === 'grid' && (session.user().roles.indexOf('admin') > -1 || session.user().roles.indexOf('agency') > -1)"
    >
      <v-btn id="xrestore"
        class="white--text" 
        fab 
        small 
        color="green darken-1" 
        slot="activator"
        @click="bus.$emit('restoreItem')"
      >
        <v-icon>undo</v-icon>
      </v-btn>
      <span>Restore Deleted {{entity}}</span>
    </v-tooltip>
    <v-tooltip top v-if="displayWhat === 'grid'">
      <v-btn id="xrefresh"
        class="white--text"
        fab
        small
        color="blue"
        @click="bus.$emit('feedGrid')"
        slot="activator"
      >
        <v-icon>refresh</v-icon>
      </v-btn>
      <span>Reload data </span>
    </v-tooltip>
    
    <!-- hard delete - only admins or agency -->
    <v-tooltip 
    top
    v-if="displayWhat === 'grid' && (session.user().roles.indexOf('admin') > -1 || session.user().roles.indexOf('agency') > -1)"
    >
      <v-btn id="xharddelete"
        class="white--text" 
        fab 
        small 
        color="red darken-2" 
        slot="activator"
        @click="bus.$emit('hardDeleteItem')"
      >
        <v-icon>remove_circle</v-icon>
      </v-btn>
      <span>Hard Delete selected {{entity}}</span>
    </v-tooltip>
    
    <v-divider></v-divider>
    <v-text-field id="xtextsearchfield"
      v-model="search"
      flat
      solo
      placeholder="Simple text search"
      hide-details
      clearable
      class="hidden-sm-and-down"
      v-on:keyup.enter="doTextSearch"
      @click:clear="bus.$emit('doTextSearch', '')"
    ></v-text-field>
    <v-tooltip top>
      <v-btn id="xsearch"
        class="white--text"
        fab
        small
        color="blue"
        @click="doTextSearch"
        slot="activator"
      >
        <v-icon>search</v-icon>
      </v-btn>
      <span>Click to search for {{entity}}</span>
    </v-tooltip>
    <v-tooltip top>
      <v-btn id="xadvancedsearch"
        class="white--text"
        fab
        small
        color="red"
        @click="bus.$emit('displayWhat', 'search', true)"
        slot="activator"
      >
        <v-icon>find_in_page</v-icon>
      </v-btn>
      <span>Advanced Search</span>
    </v-tooltip>
    <v-tooltip left v-if="displayWhat === 'grid'">
      <v-btn class="white--text" fab small color="red darken-4" slot="activator"
        @click="export2PDF" id="xexportpdf"
      >
        <v-icon>save_alt</v-icon>
      </v-btn>
      <span>Export to PDF</span>
    </v-tooltip>
    <v-tooltip left v-if="displayWhat === 'grid'">
      <v-btn class="white--text" fab small color="green darken-4" slot="activator"
       @click="export2Excel" id="xexportexcel"
       >
        <v-icon>save_alt</v-icon>
      </v-btn>
      <span>Export to Excel</span>
    </v-tooltip>
    <v-tooltip left>
      <v-btn class="white--text" fab small color="yellow darken-4" slot="activator"
       @click="$tours['buttonsTour'].start()" id="xhelp"
       >
        <v-icon>help</v-icon>
      </v-btn>
      <span>Help</span>
    </v-tooltip>
  </v-toolbar>
  <v-tour class="primary" name="buttonsTour" :steps="steps"></v-tour>
  </div>
</template>

<script>
import xCrudControls from './xCrudControls.vm.js';
export default xCrudControls;
</script>

<style lang="css">

.v-step{
  z-index: 9999;
  background: inherit !important;
}
</style>

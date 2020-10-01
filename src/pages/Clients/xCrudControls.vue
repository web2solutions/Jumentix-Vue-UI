<template>
 <v-toolbar card color="white">
    <v-tooltip top>
      <v-btn fab dark color="green" to="clients-add" slot="activator">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Add {{entity}}</span>
    </v-tooltip>
    <!-- soft delete -->
    <v-tooltip top>
      <v-btn 
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
    v-if="session.user().roles.indexOf('admin') > -1 || session.user().roles.indexOf('agency') > -1"
    >
      <v-btn 
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
    <v-tooltip top>
      <v-btn
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
    v-if="session.user().roles.indexOf('admin') > -1 || session.user().roles.indexOf('agency') > -1"
    >
      <v-btn 
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
    <v-text-field
      v-model="search"
      flat
      solo
      placeholder="Simple text search"
      hide-details
      class="hidden-sm-and-down"
      v-on:keyup.enter="doTextSearch"
    ></v-text-field>
    <v-tooltip top>
      <v-btn
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
      <v-btn
        class="white--text"
        fab
        small
        color="red"
        @click="setDialogSearch"
        slot="activator"
      >
        <v-icon>find_in_page</v-icon>
      </v-btn>
      <span>Advanced Search</span>
    </v-tooltip>
    <v-tooltip left>
      <v-btn class="white--text" fab small color="red darken-4" slot="activator"
        @click="export2PDF"
      >
        <v-icon>save_alt</v-icon>
      </v-btn>
      <span>Export to PDF</span>
    </v-tooltip>
    <v-tooltip left>
      <v-btn class="white--text" fab small color="green darken-4" slot="activator"
       @click="export2Excel"
       >
        <v-icon>save_alt</v-icon>
      </v-btn>
      <span>Export to Excel</span>
    </v-tooltip>
  </v-toolbar>
</template>

<script>
import xCrudControls from '../../components/xCRUD/xCrudControls.vm.js';
export default xCrudControls;
</script>


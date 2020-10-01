<template>
  <v-container class="fill-height pa-0 ma-0 messaging fluid" id="messaging">
    
    <template>
      <v-layout column>
        <v-flex sm12 class="white" v-if="showSidebar">
          <chat-history>
          </chat-history>
        </v-flex>
        
      </v-layout>
    </template>
  </v-container>
</template>
<script>
import ChatHistory from './ChatHistory';

export default {
  components: {
    ChatHistory
  },
  data () {
    return {
    };
  },
  computed: {
    showSidebar () {
      return this.$route.params._id === undefined;
    },
    showWindow () {
      return this.$route.params._id !== undefined;
    },
  },
};
</script>

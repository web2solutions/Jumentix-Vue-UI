<template>
<div class="name-card" style="cursor: pointer;" @click="goToUrl">
  <v-card :color="$vuetify.options.extra.sideNav" ref="card" :dark="dark" :img="cardBgImage">
    <v-card-media v-if="showTopNav">
      <v-layout row justify-space-between class="ma-0">
        <v-flex xs2>
          <v-icon color="pink">favorite</v-icon>
        </v-flex>
        <v-flex xs2 class="text-sm-right">
          <v-icon>more_vert</v-icon>
        </v-flex>
      </v-layout>
    </v-card-media>    
    <v-card-text>
      <div class="layout ma-0 align-left" :class="computeCardLayout">
        <v-avatar :size="computeAvatarSize" color="primary">
          <img v-bind:src="avatar.src" v-bind:alt="name" v-if="showAvatar">
          <span v-else class=" headline">{{ name.charAt(0) }}</span>
        </v-avatar>
        <div class="flex white--text" :class="computeTextAlgin">
          <div class="subheading">{{name}}</div>
          <span class="caption">{{role}}</span>
          <span class="online"><i class="fa fa-circle text-success"></i> Online</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
  <v-bottom-nav :value="true" color="transparent" :height="64" v-if="showBottomNav">
    <v-btn flat color="teal" value="recent">
      <span>Recent</span>
      <v-icon>history</v-icon>
    </v-btn>
    <v-btn flat color="teal" value="favorites">
      <span>Favorites</span>
      <v-icon>favorite</v-icon>
    </v-btn>
    <v-btn flat color="teal" value="nearby">
      <span>Nearby</span>
      <v-icon>place</v-icon>
    </v-btn>
  </v-bottom-nav>   
</div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: 'account-info'
    },
    avatar: {
      type: Object,
      default: null
    },
    role: {
      type: String,
      default: ''
    },
    cardBgImage: {
      type: String,
    },
    color: {
      type: String,
      default: 'blue'
    },
    dark: {
      type: Boolean,
      default: false
    },
    bottomNav: {
      type: Boolean,
      default: false
    },    
    topNav: {
      type: Boolean,
      default: false
    },      
    mini: {
      type: Boolean,
      default: false
    }    
  },
  data: () => ({

  }),
  
  computed: {
    computeCardLayout () {
      return (this.mini) ? 'row' : 'column';
    },
    computeTextAlgin () {
      return (this.mini) ? 'text-sm-right' : 'text-sm-center';
    },
    computeAvatarSize () {
      return (this.mini) ? '48' : '48';
    },
    showAvatar () {
      return this.avatar !== null && this.avatar.src;
    },

    showBottomNav () {
      return (this.mini === false && this.bottomNav); 
    },

    showTopNav () {
      return (this.mini === false && this.topNav); 
    }
    
  },

  methods: {
    goToUrl () {
      this.$router.push({ path: '/account-info' });
    }
  },


};
</script>

<style lang="stylus" scoped>
  .caption, .subheading, .online {
    font-weight:200; 
  }
  .online {
    position: absolute;
    right: 10px;
    top: 1px;
    font-size: x-small;
  }
  .name-card {
    position: relative;
  }
  .text-sm-center > .subheading {
    font-size: x-small !important;
  }
</style>

<template>
  <div id="xApp" class="xApp" ref="xApp">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <div class="EntityBuilder" id="EntityBuilder" ref="container"></div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import index from './index.vm.js'
export default index
</script>
<style lang="css">
.xApp{ width: 100%; height: 100%; }
.EntityBuilder{ width: 100%; height: 100%; }
.foreign_key{
  background-image: url(https://cdn2.iconfinder.com/data/icons/hotel-service-34/32/key_room_security_lock_door-16.png) !important;
}
.text_field{ background-image:
  url(https://cdn2.iconfinder.com/data/icons/essential-web-3/50/edit-field-type-text-fill-16.png) !important;
}



</style>

<template>
  <div id="xApp">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <div id="xWrapper"></div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import ViewModel from './ViewModel.vm.js';
export default ViewModel;
</script>
<style scoped lang="css">

.jqx-grid .jqx-adaptive-table tr:nth-child(even) {
  background-color: #000 !important;
}
.jqx-grid .jqx-adaptive-table{
  color: #666 !important;
}
table .jqx-adaptive-table{
  color: #666 !important;
}
.jqx-widget-content-dark{
  color: #666 !important;
}
.jqx-tabs-content-element{
  overflow: hidden !important; 
  padding-bottom: 80px;
}
.jqx-tabs-content-element-material{
  overflow: hidden !important; 
}
.swal2-container {
  z-index: 99999 !important;
}
</style>

<template>
  <v-app id="404">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <div style="width: 100%; height:100%;" id="xApp">
                <div id="builderLayout">
            <!--The panel content divs can have a flat structure-->
            <!--documentGroup-->
            <div data-container="Document1Panel">
                <div id="form_viewer" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                
            </div>
            
            <!--right tabbedGroup-->
            <div data-container="FieldsPanel" id="">
                <div class="button_column" id="button_fields">
                    
                </div>
                
            </div>
            <div data-container="PropertiesPanel">
                List of properties</div>
        </div>
            </div>
        </v-layout>
      </v-container>
  </v-app>
</template>


<script>
import vm from './Layout.vm.js'
export default vm
</script>

<style scoped lang="css">
.button_column {
    float: left;
    position: relative;
    width: 100%;
    background: #333;
}
.button_field {
    float: left;
    position: relative;
    width: 145px;
    height: 30px;
    margin: 1px;
    background: #666;
}
#form_viewer  {
    width: 100%;
    height: 700px !important;
    background: #333;
    position: relative;
}
.droptarget {
  float: left; 
  width: 100px; 
  height: 35px;
  margin: 15px;
  padding: 10px;
  border: 1px solid #aaaaaa;
}
.jqx-button {
    float: left !important;
    position: relative;
}
.jqx-widget-content {
    height: 100% !important;
}
</style>

<template>
  <v-container id="portalConfigTop">
    <v-card class="elevation-0 mb-5">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Portal Title</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-text-field class="pl-3" label="Type a title." v-model="title"></v-text-field>
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-flex>

          <v-flex xs12 text-xs-center>
            <div class="logo-wrap">
              <img ref="logo" v-bind:src="logo" width="200px" alt="Your Agency" />

              <v-dialog v-model="editLogo" width="850px">
                <template v-slot:activator="{ on }">
                  <v-icon color="primary" v-on="on">edit</v-icon>
                </template>

                <v-card>
                  <v-card-title class="headline grey lighten-2">Logo uploader and croppper</v-card-title>

                  <v-card-text>
                    <div class="cropper-area">
                      <input
                        ref="input"
                        type="file"
                        name="image"
                        accept="image/*"
                        @change="setImage"
                        style="display: none;"
                      />
                      <div class="img-cropper">
                        <vue-cropper
                          class="crop-wrap"
                          ref="cropper"
                          :src="imgSrc"
                          alt="Source Image"
                          width="100%"
                          dragMode="move"
                        ></vue-cropper>
                      </div>
                    </div>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-btn color="primary" small @click.prevent="zoom(0.2)">
                          <v-icon>zoom_in</v-icon>
                        </v-btn>
                        <v-btn color="primary" small @click.prevent="zoom(-0.2)">
                          <v-icon>zoom_out</v-icon>
                        </v-btn>
                        <v-btn color="primary" small @click.prevent="move(-10, 0)">
                          <v-icon>arrow_left</v-icon>
                        </v-btn>
                        <v-btn color="primary" small @click.prevent="move(10, 0)">
                          <v-icon>arrow_right</v-icon>
                        </v-btn>
                        <v-btn color="primary" small @click.prevent="move(0, -10)">
                          <v-icon>arrow_drop_up</v-icon>
                        </v-btn>
                        <v-btn color="primary" small @click.prevent="move(0, 10)">
                          <v-icon>arrow_drop_down</v-icon>
                        </v-btn>
                        <v-btn color="primary" small @click.prevent="reset">
                          <v-icon>undo</v-icon>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-btn color="primary" text @click.prevent="cropImage">preview</v-btn>
                    <v-btn color="primary" text @click="showFileChooser">upload</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn text @click="editLogo = false">Cancel</v-btn>
                    <v-btn color="green" dark text @click="saveLogo">save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-btn flat @click="bus.$emit('previewStep')">Preview</v-btn>
    <v-btn color="primary" @click="save()">Continue</v-btn>
    <v-btn flat>Cancel</v-btn>
  </v-container>
</template>
<script>
import PortalConfig from './PortalConfig.vm.js';
import 'cropperjs/dist/cropper.css';
export default PortalConfig;
</script>
<style scoped lang="css">
#portalConfig {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
.logo-wrap {
  position: relative;
}
.img-cropper {
  text-align: center;
}
.crop-wrap {
  display: inline-block !important;
}
.cropper-area {
  width: 100% !important;
}
</style>

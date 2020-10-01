<template>
  <div id="FamilyAdd">
    <v-container grid-Add-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-title primary-title>
                Step 1 - Create Family
            </v-card-title>
            <vue-perfect-scrollbar class="perfect--scrollbar--add">
              <v-card-text>
                <v-form ref="createFamily">
                  <v-layout row wrap>
                    <v-flex xs2 text-xs-center>
                      <div class="photo-wrap">
                        <v-avatar
                          size="100"
                        >
                          <v-img
                            ref="photo" 
                            v-bind:src="family.photo" 
                            alt="Your Photo Avatar"
                            height="100"
                          ></v-img>
                          <v-icon color="primary" class="add_a_photo_icon" @click="editPhoto = !editPhoto">add_a_photo</v-icon>
                        </v-avatar>
                        

                        <v-dialog
                          v-model="editPhoto"
                          width="850px"
                          id="cropper-dialog"
                          style="z-index: 9999999"
                        >

                          <v-card>
                            <v-card-title
                              class="headline grey lighten-2"
                            >
                              photo uploader and croppper
                            </v-card-title>

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
                                alt="Photo Avatar"
                                width="400px"
                                dragMode="move"
                                :viewMode="2"
                                :aspectRatio="1/1"
                              >
                              </vue-cropper>
                              </div>
                            </div>
                              <v-layout row wrap>
                                <v-flex xs12>
                                  <v-btn
                                    color="primary"
                                    small
                                    @click.prevent="zoom(0.2)"
                                  >
                                    <v-icon>zoom_in</v-icon>
                                  </v-btn>
                                  <v-btn
                                    color="primary"
                                    small
                                    @click.prevent="zoom(-0.2)"
                                  >
                                    <v-icon>zoom_out</v-icon>
                                  </v-btn>
                                  <v-btn
                                    color="primary"
                                    small
                                    @click.prevent="move(-10, 0)"
                                  >
                                    <v-icon>arrow_left</v-icon>
                                  </v-btn>
                                  <v-btn
                                    color="primary"
                                    small
                                    @click.prevent="move(10, 0)"
                                  >
                                    <v-icon>arrow_right</v-icon>
                                  </v-btn>
                                  <v-btn
                                    color="primary"
                                    small
                                    @click.prevent="move(0, -10)"
                                  >
                                    <v-icon>arrow_drop_up</v-icon>
                                  </v-btn>
                                  <v-btn
                                    color="primary"
                                    small
                                    @click.prevent="move(0, 10)"
                                  >
                                    <v-icon>arrow_drop_down</v-icon>
                                  </v-btn>
                                  <v-btn
                                    color="primary"
                                    small
                                    @click.prevent="reset"
                                  >
                                    <v-icon>undo</v-icon>
                                  </v-btn>
                                </v-flex>
                              </v-layout>
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                                <v-btn
                                  color="primary"
                                  text
                                  @click.prevent="cropImage"
                                >
                                  preview
                                </v-btn>
                                <v-btn
                                  color="primary"
                                  text
                                  @click="showFileChooser"
                                >
                                  upload
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  @click="editPhoto = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  color="green"
                                  dark
                                  text
                                  @click="savePhoto"
                                >
                                  save
                                </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </div>
                    </v-flex>
                    <v-flex xs12 md6 pr-4>
                      <v-text-field
                        v-model="family.name"
                        label="Name"
                        clearable
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 md7 mx-5 mt-3>
                      <v-text-field
                        v-model="family.email"
                        label="Email"
                        clearable
                        :rules="[rules.required, rules.email]"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 md7 mx-5 mt-3>
                      <v-text-field
                        v-model="family.address_line_1"
                        label="Address Line 1"
                        clearable
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 md7 mx-5>
                      <v-text-field
                        v-model="family.address_line_2"
                        label="Address Line 2"
                        clearable
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 md7 mx-5>
                      <v-layout row wrap>
                        <v-flex xs12 md6 pr-2>
                          <v-text-field
                            v-model="family.address_city"
                            label="City"
                            clearable
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-text-field
                            v-model="family.address_state"
                            label="State"
                            clearable
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs12 md7 mx-5>
                      <v-layout row wrap>
                        <v-flex xs12 md6 pr-2>
                          <v-text-field
                            v-model="family.address_zip"
                            label="ZIP"
                            clearable
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-autocomplete
                            label="Country"
                            :items="country"
                            v-model="family.address_country"
                            @change="setCallingCode"
                            :rules="[rules.required]"
                          ></v-autocomplete>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs12 md7 mx-5>
                      <v-layout row wrap>
                        <v-flex xs12 md3 pr-2>
                          <v-autocomplete
                            v-model="family.phone_country_code"
                            label="Country"
                            :items="countrys"
                            item-text="name"
                            item-value="callingCode"
                            clearable
                            :rules="[rules.required]"
                          >
                            <template v-slot:selection="data">
                              <v-avatar size="16" class="pr-1">
                                  <img :src="data.item.flag">
                              </v-avatar> {{ data.item.callingCode }}
                            </template>
                            <template v-slot:item="data">
                              <template v-if="typeof data.item !== 'object'">
                                <v-list-tile-content v-text="data.item"></v-list-tile-content>
                              </template>
                              <template v-else>
                                <v-list-tile-avatar size="26">
                                  <img :src="data.item.flag">
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                  <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                  <v-list-tile-sub-title v-html="'Calling Code: ' + data.item.callingCode"></v-list-tile-sub-title>
                                </v-list-tile-content>
                              </template>
                            </template>
                          </v-autocomplete>
                        </v-flex>
                        <v-flex xs12 md3 pr-2>
                          <v-text-field
                            v-model="family.phone_area_number"
                            label="Phone area number"
                            clearable
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-text-field
                            v-model="family.phone_number"
                            label="Phone number"
                            clearable
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-card-text>
            </vue-perfect-scrollbar>  
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn>Reset</v-btn>
              <v-btn color="primary" @click="createFamily">Create</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import FamilyAdd from './add.vm.js';
export default FamilyAdd;
</script>
<style scoped lang="css">
.perfect--scrollbar--add {
  height: calc(100vh - 250px);
}
.photo-wrap {
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
.add_a_photo_icon {
  position: absolute;
  bottom: -35px;
}
.v-dialog__content--active, .v-overlay--active {
  z-index: 999999 !important;
}
.v-overlay--active {
  z-index: 999998 !important;
}
</style>

<template>
  <v-app id="mapForm" class="primary">
    <v-content>
      <v-container fluid fill-height id="mapFormTop">
        <v-layout align-center justify-center>
          <v-flex xs12 sm9>
            <v-card class="elevation-1 pa-3 cardForm">
              <v-card-title class="pa-0 font-weight-light title">
                <v-spacer></v-spacer>
                JumentiX Forms
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text>
                <!-- <div class="layout column align-center pb-4">
                  <img src="/static/logo.png" alt="JumentiX" height="100">
                </div> -->
                <v-container grid-list-xs>
                  <v-layout row wrap>
                    <v-flex xs8>
                      <div class="form_description">
                        <h1 @click="editProps('title')" :class="(editActive === 'title' ? 'highlighted' : '')"
                          class="title">{{ formData.title }}</h1>
                        <h2 @click="editProps('subheading')" :class="(editActive === 'subheading' ? 'highlighted' : '')"
                          class="subheading">{{ formData.description }}</h2>
                      </div>

                      <v-tabs v-model="activePage" color="primary" dark slider-color="yellow">
                        <v-tab v-for="page in formList" :key="page.id">
                          {{ page.title }}

                        </v-tab>
                        <v-tab-item v-for="(page, pageIndex) in formList" :key="page.id">
                          <v-card flat>
                            <v-card-text>

                              <draggable class="dropArea list-group pr-3" :list="formList[pageIndex].fields"
                                group="elements" chosen-class="chosen" @change="log" direction="vertical">
                                <div class="list-group-item" style="position: relative;"
                                  :class="[element.selected === false || 'fieldSelected']"
                                  v-on:click.stop="selectField(element, index)"
                                  v-for="(element, index) in formList[pageIndex].fields" :key="element.id">
                                  <template v-if="element.type === 'arrayOfSchema'">
                                    <div :id="'parent_' + element.id" style="width: 100%">
                                      <h3>{{element.label}}</h3>
                                    </div>
                                    <!-- <div v-for="(subElement, subIndex) in element.fields" :key="subElement.name" :style="'width:' + (100 / element.fields.length) + '%; float:left; position: relative;'">
                                      <div style="margin-top: 10px;">{{subElement.spec['x-ui'].form.label}}</div>
                                      <div :id="'parent_' + subElement.id" style="width: 100%"></div>
                                      <div v-if="subElement.spec.description.length > 0">{{subElement.spec.description}}</div>
                                    </div> -->

                                    <!-- <div style="margin-top: 10px;">{{element.spec['x-ui'].form.label}}</div>
                                    <div :id="'parent_' + element.id" style="width: 100%"></div>
                                    <div v-if="element.spec.description.length > 0">{{element.spec.description}}</div> -->
                                  </template>
                                  <template v-else>
                                    <div style="margin-top: 10px;">{{element.spec['x-ui'].form.label}}</div>
                                    <div :id="'parent_' + element.id" style="width: 100%"></div>
                                    <div v-if="element.spec.description.length > 0">{{element.spec.description}}</div>
                                  </template>
                                </div>
                              </draggable>
                            </v-card-text>
                          </v-card>
                        </v-tab-item>
                      </v-tabs>

                    </v-flex>
                    <v-flex xs4>
                      <v-tabs v-model="activePanelTab" color="primary" dark :id="'xtools'">
                        <v-tab class="caption">
                          Form
                        </v-tab>
                        <v-tab-item>
                          <v-card flat>
                            <v-card-text>
                              <v-layout row wrap>
                                <v-flex xs12>
                                  <v-text-field label="Form Title" v-model="formData.title"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                  <v-textarea label="Form Description" v-model="formData.description"></v-textarea>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                          </v-card>
                        </v-tab-item>
                        <v-tab class="caption">
                          Pages
                        </v-tab>
                        <v-tab-item>
                          <v-card flat>
                            <v-card-text class="pa-0">
                              <template>
                                <v-toolbar dark>
                                  <v-btn flat @click="addPage">
                                    <v-icon>note_add</v-icon> add
                                  </v-btn>
                                  <v-btn flat @click="editPage">
                                    <v-icon>edit</v-icon> edit
                                  </v-btn>
                                  <v-btn flat @click="removePage">
                                    <v-icon>remove</v-icon> remove
                                  </v-btn>
                                </v-toolbar>
                              </template>
                              <div style="border: none;" id="parent_pagesTree"></div>
                            </v-card-text>
                          </v-card>
                        </v-tab-item>
                        <v-tab class="caption">
                          Add
                        </v-tab>
                        <v-tab-item>
                          <v-card flat>
                            <v-card-text class="pa-0">
                              <v-tabs v-model="activeAddFieldTab" dark slider-color="yellow">
                                <v-tab ripple>
                                  Fields
                                </v-tab>
                                <v-tab-item>
                                  <draggable class="elements list-group" :list="elementsList"
                                    :group="{ name: 'elements', pull: 'clone', put: false }" :sort="false"
                                    ghost-class="ghost" :clone="cloneItem" @change="log" tag="ul">
                                    <li class="list-group-item" v-for="element in elementsList" :key="element.name">
                                      <v-icon small>{{ element.icon }}</v-icon> {{ element.label }}
                                    </li>
                                  </draggable>
                                </v-tab-item>
                                <v-tab ripple>
                                  Library Fields
                                </v-tab>
                                <v-tab-item>
                                  <v-flex xs12>
                                    <v-select :items="entities" label="Target entity"
                                      @change="setFieldsOfSelectedEntity">
                                    </v-select>
                                  </v-flex>

                                

                                  <draggable class="elements list-group" :list="selectedEntityFields"
                                    :group="{ name: 'elements', pull: 'clone', put: false }" :sort="false"
                                    ghost-class="ghost" :clone="cloneSchema" @change="logSchema" tag="ul">
                                    <li class="list-group-item" v-for="element in selectedEntityFields"
                                      :key="element.name" style="text-align: center; height: 80px; overflow: hidden;">
                                      <v-icon small>domain</v-icon> <br>{{ element.label }}
                                    </li>
                                  </draggable>
                                  
                                  <draggable class="elements list-group" :list="selectedEntitySchemas"
                                    :group="{ name: 'elements', pull: 'clone', put: false }" :sort="false"
                                    ghost-class="ghost" :clone="cloneSchema" @change="logSchema" tag="ul">
                                    <li class="list-group-item" v-for="element in selectedEntitySchemas"
                                      :key="element.name" style="text-align: center; height: 80px; overflow: hidden;">
                                      <v-icon small>domain</v-icon> <br>{{ element.label }}
                                    </li>
                                  </draggable>
                                </v-tab-item>
                              </v-tabs>
                            </v-card-text>
                          </v-card>
                        </v-tab-item>

                        <v-tab class="caption">
                          Field Properties
                        </v-tab>
                        <v-tab-item>
                          <v-card flat>
                            <template v-if="selectedFieldIndex !== false">
                              <template v-if="selectedFieldType === 'arrayOfSchema'">
                                <SchemaEditor :selectedEntitySchemas="selectedEntitySchemas" :bus="bus" :store="store"
                                  :ftypes="ftypes" :textFormats="textFormats">
                                </SchemaEditor>
                              </template>
                              <template v-else>
                                <v-tabs v-model="field_tab" background-color="primary" dark>
                                  <v-tab>Form</v-tab>
                                  <v-tab-item>
                                    <v-card flat>
                                      <v-card-text>
                                        <v-layout row wrap>
                                          <v-flex xs6>
                                            <v-text-field label="Field Label"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.label">
                                            </v-text-field>
                                          </v-flex>
                                          <v-flex xs6>
                                            <v-text-field label="Field Name"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].name"
                                              :disabled="true"></v-text-field>
                                          </v-flex>
                                          <v-flex xs12>
                                            <v-text-field label="Field Description"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec.description">
                                            </v-text-field>
                                          </v-flex>
                                          <v-flex xs6>
                                            <v-select :items="ftypes"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.type"
                                              label="Field Type" :disabled="true"></v-select>
                                          </v-flex>


                                          <v-flex xs6
                                            v-if="canFormat(formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.type)">
                                            <v-text-field label="Example value"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec.example">
                                            </v-text-field>
                                          </v-flex>
                                          <v-flex xs12>
                                            <v-switch
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-editable']"
                                              label="Enable field when editing the form"></v-switch>
                                          </v-flex>
                                          <v-flex xs12>
                                            <v-switch
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.hide"
                                              label="Hide field when inserting and editing the form"></v-switch>
                                          </v-flex>
                                          <v-flex xs12
                                            v-if="canFormat(formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.type)">
                                            <v-select
                                              v-if="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.type === 'text'"
                                              :items="textFormats"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-format']"
                                              label="Field Format"></v-select>
                                            <v-select
                                              v-if="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.type === 'number'"
                                              :items="numberFormats"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-format']"
                                              label="Field Format"></v-select>
                                          </v-flex>
                                          <v-flex xs6
                                            v-if="canSetLength(formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.type)">
                                            <v-text-field label="Field Min Lenght"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec.minLength"
                                              hint="0 to disable"></v-text-field>
                                          </v-flex>
                                          <v-flex xs6
                                            v-if="canSetLength(formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.type)">
                                            <v-text-field label="Field Max Lenght"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec.maxLength"
                                              hint="0 to disable"></v-text-field>
                                          </v-flex>

                                          <v-divider
                                            v-if="isMultiOptionField(formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.type)">
                                          </v-divider>
                                          <v-subheader
                                            v-if="isMultiOptionField(formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.type)">
                                            Field options</v-subheader>
                                          <!-- multiselect options -->
                                          <template
                                            v-if="isMultiOptionField(formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.type)">
                                            <v-flex xs12>
                                              <v-tabs v-model="field_multiselect_tab" background-color="primary" dark>
                                                <v-tab>Static Options</v-tab>
                                                <v-tab-item>
                                                  <v-card flat>
                                                    <v-card-text>
                                                      <template>
                                                        <v-subheader>Label / Value</v-subheader>
                                                        <v-text-field label="New option"
                                                          v-model="newOptionText"
                                                          hint="Type the new option"></v-text-field>
                                                          <v-btn color="success" @click="addNewOption(selectedPageIndex, selectedFieldIndex)">add</v-btn>
                                                          
                                                        <v-list dense>
                                                          <v-list-tile v-for="item in formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.options"
                                                            :key="item">
                                                            <v-list-tile-content>{{ item }}</v-list-tile-content>
                                                            <v-list-tile-content class="align-end">
                                                              <v-btn color="error" @click="deleteOption(selectedPageIndex, selectedFieldIndex, item)">delete</v-btn>
                                                            </v-list-tile-content>
                                                          </v-list-tile>
                                                        </v-list>
                                                      </template>
                                                    </v-card-text>
                                                  </v-card>
                                                </v-tab-item>
                                                <v-tab>Live Options</v-tab>
                                                <v-tab-item>
                                                  <v-card flat>
                                                    <v-card-text>
                                                      <v-flex xs12>
                                                        <v-select :items="entities"
                                                          v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui']['collection-link']"
                                                          label="Target entity" @change="setPropertiesOfSelectedEntity">
                                                        </v-select>
                                                      </v-flex>
                                                      <v-flex xs12>
                                                        <v-select :items="selectedEntityProperties"
                                                          v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui']['collection-link-label']"
                                                          label="Entity property used as label"></v-select>
                                                      </v-flex>
                                                      <v-flex xs12>
                                                        <v-select :items="selectedEntityProperties"
                                                          v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui']['collection-link-value']"
                                                          label="Entity property used as value"></v-select>
                                                      </v-flex>
                                                    </v-card-text>
                                                  </v-card>
                                                </v-tab-item>
                                              </v-tabs>
                                            </v-flex>
                                          </template>


                                        </v-layout>
                                      </v-card-text>
                                    </v-card>
                                  </v-tab-item>
                                  <v-tab>Grid</v-tab>
                                  <v-tab-item>
                                    <v-card flat>
                                      <v-card-text>
                                        <v-layout row wrap>
                                          <v-flex xs6>
                                            <v-select :items="ftypes"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.type"
                                              label="Column Type" hint="Column type"></v-select>
                                          </v-flex>
                                          <v-flex xs6>
                                            <v-switch
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].grid.hide"
                                              label="Hide Column" hint="Does not display this column"></v-switch>
                                          </v-flex>
                                          <v-flex xs6>
                                            <v-text-field label="Column width"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].grid.width"
                                              hint="Integer or % values"></v-text-field>
                                          </v-flex>
                                        </v-layout>
                                      </v-card-text>
                                    </v-card>
                                  </v-tab-item>
                                  <v-tab>Swagger</v-tab>
                                  <v-tab-item>
                                    <v-card flat>
                                      <v-card-text>
                                        <v-layout row wrap>
                                          <v-flex xs6>
                                            <v-select :items="stypes"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec.type"
                                              label="API Data type"></v-select>
                                          </v-flex>
                                          <v-flex xs6>
                                            <v-select :items="sformats"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec.format"
                                              label="Format"></v-select>
                                          </v-flex>
                                          <v-flex xs6>
                                            <v-switch
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec.readOnly"
                                              label="Read Only"></v-switch>
                                          </v-flex>

                                        </v-layout>
                                      </v-card-text>
                                    </v-card>
                                  </v-tab-item>
                                  <v-tab>Data</v-tab>
                                  <v-tab-item>
                                    <v-card flat>
                                      <v-card-text>
                                        <v-layout row wrap>
                                          <v-flex xs12>
                                            <v-select :items="mtypes"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-dom'].type"
                                              label="Data type"></v-select>
                                          </v-flex>
                                          <v-flex xs12>
                                            <v-switch
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-required']"
                                              label="Required field"></v-switch>
                                          </v-flex>
                                        </v-layout>

                                      </v-card-text>
                                    </v-card>
                                  </v-tab-item>
                                  <v-tab>Bind</v-tab>
                                  <v-tab-item>
                                    <v-card flat>
                                      <v-card-text>
                                        <v-layout row wrap>
                                          <v-flex xs12>
                                            <v-select :items="entities"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui']['collection-link']"
                                              label="Target entity" @change="setPropertiesOfSelectedEntity"></v-select>
                                          </v-flex>
                                          <v-flex xs12>
                                            <v-select :items="selectedEntityProperties"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui']['collection-link-label']"
                                              label="Entity property used as label"></v-select>
                                          </v-flex>
                                          <v-flex xs12>
                                            <v-select :items="selectedEntityProperties"
                                              v-model="formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui']['collection-link-value']"
                                              label="Entity property used as value"></v-select>
                                          </v-flex>
                                        </v-layout>

                                      </v-card-text>
                                    </v-card>
                                  </v-tab-item>
                                </v-tabs>
                              </template>
                            </template>
                          </v-card>
                        </v-tab-item>
                      </v-tabs>

                    </v-flex>
                  </v-layout>

                </v-container>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import MAPForm from './Index.vm.js'
export default MAPForm
</script>
<style scoped lang="css">
  #mapForm {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }

  .target {
    background: #b4b7b9;
  }

  .cardForm {
    min-height: 550px;
  }

  .form_description {
    border-bottom: 1px dotted #ccc;
    clear: both;
    display: block;
    margin: 0 0 1em;
  }

  .elements,
  .sortable-ghost {
    list-style: none;
    padding: 0;
    cursor: move;
  }

  .elements li {
    display: inline-block;
    padding: 3px;
    width: 50%;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.3);
    border: 1px solid #ECEFF1;
    background-color: #fff;
    cursor: move;
  }

  .elements li:hover {
    border: 1px solid #b4b7b9;
  }

  .dropArea {
    width: 100%;
    cursor: move;
    background: #ECEFF1;
    padding: 5px;
  }

  .sortable-chosen {
    border: 1px dotted #a82e09;
    padding: 10px;
    background-color: #fff;
  }

  .chosen,
  .fieldSelected {
    border: 1px dotted #a82e09 !important;
    padding: 10px;
    margin: 10px 0px;
    background-color: #fff;
    cursor: move;
  }

  h1.title,
  h2.subheading {
    margin: 0 0 3px;
    clear: left;
    border: 1px solid #fff;
  }

  h1.title:hover,
  h2.subheading:hover {
    border: 1px dotted #FF9F80;
    cursor: pointer;
    cursor: hand;
    background-color: #EFFAB4;
  }

  h1.highlighted,
  h2.highlighted {
    background-color: #FFEAE7;
    border: 1px solid #FF9F80;
  }

  .jqx-widget-content {
    overflow: scroll !important;
  }

</style>

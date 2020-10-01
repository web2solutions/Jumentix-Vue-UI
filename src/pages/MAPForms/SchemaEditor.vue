<template>
  <div>
    <v-tabs v-model="activeSchemaEditorTab" dark slider-color="yellow">
      <v-tab ripple>
        Schema Fields
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <div id="parent_schemaFieldsTree"></div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab ripple>
        Field Settings
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs6>
                <v-text-field label="Field Label"
                  v-model="fieldProps.spec['x-ui'].form.label">
                </v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="Field Name" v-model="fieldProps.name"
                  :disabled="true"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Field Description"
                  v-model="fieldProps.spec.description"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-select :items="ftypes"
                  v-model="fieldProps.spec['x-ui'].form.type"
                  label="Field Type" :disabled="true"></v-select>
              </v-flex>


              <v-flex xs6
                v-if="canFormat(fieldProps.spec['x-ui'].form.type)">
                <v-text-field label="Example value"
                  v-model="fieldProps.spec.example"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-switch v-model="fieldProps.spec['x-editable']"
                  label="Enable field when editing the form"></v-switch>
              </v-flex>
              <v-flex xs12>
                <v-switch v-model="fieldProps.spec['x-ui'].form.hide"
                  label="Hide field when inserting and editing the form"></v-switch>
              </v-flex>
              <v-flex xs12
                v-if="canFormat(fieldProps.spec['x-ui'].form.type)">
                <v-select
                  v-if="fieldProps.spec['x-ui'].form.type === 'text'"
                  :items="textFormats" v-model="fieldProps.spec['x-format']"
                  label="Field Format"></v-select>
                <v-select
                  v-if="fieldProps.spec['x-ui'].form.type === 'number'"
                  :items="numberFormats"
                  v-model="fieldProps.spec['x-format']"
                  label="Field Format"></v-select>
              </v-flex>
              <v-flex xs6
                v-if="canSetLength(fieldProps.spec['x-ui'].form.type)">
                <v-text-field label="Field Min Lenght"
                  v-model="fieldProps.spec.minLength" hint="0 to disable">
                </v-text-field>
              </v-flex>
              <v-flex xs6
                v-if="canSetLength(fieldProps.spec['x-ui'].form.type)">
                <v-text-field label="Field Max Lenght"
                  v-model="fieldProps.spec.maxLength" hint="0 to disable">
                </v-text-field>
              </v-flex>

              <v-divider
                v-if="isMultiOptionField(fieldProps.spec['x-ui'].form.type)">
              </v-divider>
              <v-subheader
                v-if="isMultiOptionField(fieldProps.spec['x-ui'].form.type)">
                Field options</v-subheader>
              <!-- multiselect options -->
              <template
                v-if="isMultiOptionField(fieldProps.spec['x-ui'].form.type)">
                <v-flex xs12>
                  <v-tabs v-model="field_multiselect_tab" background-color="primary" dark>
                    <v-tab>Static Options</v-tab>
                    <v-tab-item>
                      <v-card flat>
                        <v-card-text>
                          <template>
                            <v-subheader>Label / Value</v-subheader>
                            <v-list dense>
                              <v-list-tile v-for="item in selectedFieldStaticOptions" :key="item.value">
                                <v-list-tile-content>{{ item.label }}</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ item.value }}</v-list-tile-content>
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
                              v-model="fieldProps.spec['x-ui']['collection-link']"
                              label="Target entity" @change="setPropertiesOfSelectedEntity"></v-select>
                          </v-flex>
                          <v-flex xs12>
                            <v-select :items="selectedEntityProperties"
                              v-model="fieldProps.spec['x-ui']['collection-link-label']"
                              label="Entity property used as label"></v-select>
                          </v-flex>
                          <v-flex xs12>
                            <v-select :items="selectedEntityProperties"
                              v-model="fieldProps.spec['x-ui']['collection-link-value']"
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
    </v-tabs>
  </div>
</template>
<script>
import SchemaEditor from './SchemaEditor.vm.js';
export default SchemaEditor;
</script>
<style scoped lang="css">

</style>

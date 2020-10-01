
<template>
  <v-container fill-height id="TaskConfigTop">
    <v-card class="elevation-0">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-toolbar flat color="white" class="pr-0">
              <v-toolbar-title>Tasks</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn color="primary" small dark class="mb-2" @click="taskDialog = true">New Task</v-btn>
            </v-toolbar>

            <v-data-table :headers="headers" :items="taskItems">
              <template v-slot:items="props">
                <td>{{ props.item.name }}</td>
                <td :id="'role-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('Role', props.item.role, 'role-name-' + props.index) }}</td>
                <td :id="'sub_role-name-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('SubRole', props.item.sub_role, 'sub_role-name-' + props.index) }}</td>
                <!-- <td>{{ props.item.role ? props.item.role.name : '' }}</td> 
                <td>{{ props.item.sub_role }}</td>-->
                <td>{{ props.item.assignment }}</td>
                <td>{{ props.item.task.length > 0 ? 'Yes' : 'No' }}</td>
                <td>
                  <v-icon small class="mr-2" @click="editItem(props.item, 'task')">edit</v-icon>
                  <v-icon small @click="deleteItem(props.item, 'task')">delete</v-icon>
                </td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions class="mt-5">
        <v-btn flat @click="bus.$emit('previewStep')">Preview</v-btn>
        <v-btn color="primary" @click="bus.$emit('nextStep', 10)">Continue</v-btn>
        <v-btn flat>Cancel</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>

    <!-- New Task Dialog -->
    <v-dialog v-model="taskDialog" scrollable max-width="750px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ taskFormTitle }}</span>
        </v-card-title>
        <v-card-text class="py-0">
          <v-form ref="task" lazy-validation>
            <v-container grid-list-md pt-0>
              <v-layout wrap>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="taskTemplateSchema.name"
                    label="Task Name"
                    prepend-icon="text_fields"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="taskTemplateSchema.description"
                    label="Task Description"
                    prepend-icon="text_fields"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="taskTypes"
                    v-model="taskTemplateSchema.type"
                    label="Type"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="notificationType"
                    v-model="taskTemplateSchema.notification_type"
                    label="Notification Type"
                  ></v-select>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="statusItems"
                    v-model="taskTemplateSchema.status"
                    item-text="label"
                    item-value="_id"
                    label="Status"
                  ></v-select>                
                </v-flex>
                <v-flex xs12 md6 >
                </v-flex>
                <v-flex xs12 md6 >
                    <v-switch v-model="taskTemplateSchema.disable" label="Disable"></v-switch>
                </v-flex>

                <v-flex xs12 md6 >
                    <v-switch v-model="taskTemplateSchema.auto_approve" label="Auto Approve"></v-switch>
                </v-flex>
                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="expire_unit"
                    v-model="taskTemplateSchema.expire_unit"
                    label="Expire Unit"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="taskTemplateSchema.expire"
                    label="Expire"
                    prepend-icon="text_fields"
                    mask="##"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="assignment"
                    v-model="taskTemplateSchema.assignment"
                    label="Assignment"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="taskTemplateSchema.url"
                    label="URL"
                    prepend-icon="text_fields"
                    hint="Exemple: http://www.exemple.com"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="roleItems"
                    v-model="taskTemplateSchema.role"
                    item-text="name"
                    item-value="_id"
                    @change="fillSubRole"
                    label="Role"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="subRoleItems"
                    v-model="taskTemplateSchema.sub_role"
                    item-text="name"
                    item-value="_id"
                    label="Sub Role"
                  ></v-select>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="referenceTypeItems"
                    v-model="taskTemplateSchema.reference"
                    item-text="name"
                    item-value="_id"
                    label="Reference Type"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="surveyItems"
                    v-model="taskTemplateSchema.survey"
                    item-text="name"
                    item-value="_id"
                    label="Survey"
                  ></v-select>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12 pt-2>
                  <v-toolbar flat color="white" class="pr-0">
                    <v-toolbar-title>Rules</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="['show', 'hide']"
                    v-model="taskTemplateSchema.rule_action"
                    label="Rule Action"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="['all', 'any']"
                    v-model="taskTemplateSchema.rule_match"
                    label="Rule Match"
                  ></v-select>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="['approval', 'submission']"
                    v-model="taskTemplateSchema.rule_trigger_when"
                    label="Rule Trigger"
                  ></v-select>
                </v-flex>

                <v-flex xs12 pt-2>
                  <v-toolbar flat color="white" class="pr-0">
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      small
                      dark
                      class="mb-2"
                      @click="ruleDialog = true"
                    >New Rule</v-btn>
                  </v-toolbar>
                </v-flex>

                <v-flex xs12>
                  <v-data-table :headers="rulesHeaders" :items="rulesItems">
                    <template v-slot:items="props">
                      <td>{{ props.item.entity }}</td>
                      <td>{{ props.item.field }}</td>
                      <td>{{ props.item.condition }}</td>
                      <td>{{ props.item.match_value }}</td>
                      <td>
                        <v-icon small class="mr-2" @click="editItem(props.item, 'rule')">edit</v-icon>
                        <v-icon small @click="deleteItem(props.item, 'rule')">delete</v-icon>
                      </td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12>
                  <v-toolbar flat color="white" class="pr-0">
                    <v-toolbar-title>Sub Tasks</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      small
                      dark
                      class="mb-2"
                      @click="subTaskDialog = true"
                    >New Sub Task</v-btn>
                  </v-toolbar>

                  <v-data-table :headers="headers" :items="subTaskItems">
                    <template v-slot:items="props">
                      <td>{{ props.item.name }}</td>
                      <td :id="'role-name-sub-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('Role', props.item.role, 'role-name-sub-' + props.index) }}</td>
                      <td :id="'sub_role-name-sub-' + props.index"><v-progress-linear :indeterminate="true"></v-progress-linear>{{ fillField('SubRole', props.item.sub_role, 'sub_role-name-sub-' + props.index) }}</td>
                      <td>{{ props.item.assignment }}</td>
                      <td>{{ props.item.task ? props.item.task.length > 0 ? 'Yes' : 'No' : 'No' }}</td>
                      <td>
                        <v-icon small class="mr-2" @click="editItem(props.item, 'subTask')">edit</v-icon>
                        <v-icon small @click="deleteItem(props.item, 'subTask')">delete</v-icon>
                      </td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close('task')">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save('task')">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- New Sub Task Dialog -->
    <v-dialog v-model="subTaskDialog" scrollable max-width="750px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ subTaskFormTitle }}</span>
        </v-card-title>
        <v-card-text class="py-0">
          <v-form ref="subTask" lazy-validation>
            <v-container grid-list-md pt-0>
              <v-layout wrap>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="subTaskTemplateSchema.name"
                    label="Sub Task Name"
                    prepend-icon="text_fields"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="subTaskTemplateSchema.description"
                    label="Sub Task Description"
                    prepend-icon="text_fields"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="taskTypes"
                    v-model="subTaskTemplateSchema.type"
                    label="Type"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="notificationType"
                    v-model="subTaskTemplateSchema.notification_type"
                    label="Notification Type"
                  ></v-select>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="statusItems"
                    v-model="subTaskTemplateSchema.status"
                    item-text="label"
                    item-value="_id"
                    label="Status"
                  ></v-select>                
                </v-flex>
                <v-flex xs12 md6 >
                </v-flex>
                <v-flex xs12 md6 >
                    <v-switch v-model="subTaskTemplateSchema.disable" label="Disable"></v-switch>
                </v-flex>

                <v-flex xs12 md6 >
                    <v-switch v-model="subTaskTemplateSchema.auto_approve" label="Auto Approve"></v-switch>
                </v-flex>
                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="expire_unit"
                    v-model="subTaskTemplateSchema.expire_unit"
                    label="Expire Unit"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="subTaskTemplateSchema.expire"
                    label="Expire"
                    prepend-icon="text_fields"
                    mask="##"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="assignment"
                    v-model="subTaskTemplateSchema.assignment"
                    label="Assignment"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="subTaskTemplateSchema.url"
                    label="URL"
                    prepend-icon="text_fields"
                    hint="Exemple: http://www.exemple.com"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="roleItems"
                    v-model="subTaskTemplateSchema.role"
                    item-text="name"
                    item-value="_id"
                    @change="fillSubRole"
                    label="Role"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="subRoleItems"
                    v-model="subTaskTemplateSchema.sub_role"
                    item-text="name"
                    item-value="_id"
                    label="Sub Role"
                  ></v-select>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="referenceTypeItems"
                    v-model="subTaskTemplateSchema.reference"
                    item-text="name"
                    item-value="_id"
                    label="Reference Type"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="surveyItems"
                    v-model="subTaskTemplateSchema.survey"
                    item-text="name"
                    item-value="_id"
                    label="Survey"
                  ></v-select>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12 pt-2>
                  <v-toolbar flat color="white" class="pr-0">
                    <v-toolbar-title>Rules</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="['show', 'hide']"
                    v-model="subTaskTemplateSchema.rule_action"
                    label="Rule Action"
                  ></v-select>
                </v-flex>
                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="['all', 'any']"
                    v-model="subTaskTemplateSchema.rule_match"
                    label="Rule Match"
                  ></v-select>
                </v-flex>

                <v-flex xs12 md6>
                  <v-select
                    prepend-icon="toc"
                    :items="['approval', 'submission']"
                    v-model="subTaskTemplateSchema.rule_trigger_when"
                    label="Rule Trigger"
                  ></v-select>
                </v-flex>

                <v-flex xs12 pt-2>
                  <v-toolbar flat color="white" class="pr-0">
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      small
                      dark
                      class="mb-2"
                      @click="ruleDialog = true"
                    >New Rule</v-btn>
                  </v-toolbar>
                </v-flex>

                <v-flex xs12>
                  <v-data-table :headers="rulesHeaders" :items="rulesSubTaskItems">
                    <template v-slot:items="props">
                      <td>{{ props.item.entity }}</td>
                      <td>{{ props.item.field }}</td>
                      <td>{{ props.item.condition }}</td>
                      <td>{{ props.item.match_value }}</td>
                      <td>
                        <v-icon small class="mr-2" @click="editItem(props.item, 'ruleSub')">edit</v-icon>
                        <v-icon small @click="deleteItem(props.item, 'rule')">delete</v-icon>
                      </td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12>
                  <v-toolbar flat color="white" class="pr-0">
                    <v-toolbar-title>Sub Tasks</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      small
                      dark
                      class="mb-2"
                      @click="subSubTaskDialog = true"
                    >New Sub Sub Task</v-btn>
                  </v-toolbar>

                  <v-data-table :headers="headers" :items="subSubTaskItems">
                    <template v-slot:items="props">
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.role }}</td>
                      <td>{{ props.item.sub_role }}</td>
                      <td>{{ props.item.assignment }}</td>
                      <td>{{ props.item.task }}</td>
                      <td>
                        <v-icon small class="mr-2" @click="editItem(props.item, 'subTask')">edit</v-icon>
                        <v-icon small @click="deleteItem(props.item, 'subTask')">delete</v-icon>
                      </td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close('subTask')">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save('subTask')">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- New Rule Dialog -->
    <v-dialog v-model="ruleDialog" scrollable max-width="350px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ rulesFormTitle }}</span>
        </v-card-title>
        <v-card-text class="py-0">
          <v-form ref="rule" lazy-validation>
            <v-container grid-list-md pt-0>
              <v-layout wrap>
                <v-flex xs12>
                  <v-select
                    prepend-icon="toc"
                    :items="entityItems"
                    v-model="taskRuleSchema.entity"
                    label="Entity"
                    @change="fillEntityField"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    prepend-icon="toc"
                    :items="entityFieldsItems"
                    v-model="taskRuleSchema.field"
                    label="Field"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    prepend-icon="toc"
                    :items="['equal', 'not equal', 'contains', 'does not contains']"
                    v-model="taskRuleSchema.condition"
                    label="Condition"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="taskRuleSchema.match_value"
                    label="Value"
                    prepend-icon="text_fields"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close('rule')">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save('rule')">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import TaskConfig from './TaskConfig.vm.js';
export default TaskConfig;
</script>
<style scoped lang="css">

</style>

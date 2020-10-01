<template>
  <v-container grid-list-xl fluid py-0>
    <v-layout row wrap>
      <v-flex xs12 v-if="session.user().role !== 'parent' && session.user().role !== 'child'">
        <v-toolbar flat color="transparent" class="toolbar--task">
          <v-speed-dial
            absolute
            left
            direction="bottom"
            open
            transition="slide-y-transition"
            class="fab btn-add"
          >
            <v-btn slot="activator" color="green" dark fab>
              <v-icon>add</v-icon>
              <v-icon>close</v-icon>
            </v-btn>

            <v-tooltip right>
              <v-btn
                fab
                dark
                small
                color="light-blue darken-4"
                hover
                slot="activator"
                @click="openAddDialog('group')"
              >
                <v-icon>layers</v-icon>
              </v-btn>
              <span>Create a new Group</span>
            </v-tooltip>
            <v-tooltip right>
              <v-btn
                fab
                dark
                small
                color="light-blue darken-2"
                slot="activator"
                @click="openAddDialog('subGroup')"
              >
                <v-icon>fas fa-layer-group</v-icon>
              </v-btn>
              <span>Create a new SubGroup</span>
            </v-tooltip>
            <v-tooltip right>
              <v-btn
                fab
                dark
                small
                color="light-blue"
                slot="activator"
                @click="bus.$emit('createItem')"
              >
                <v-icon>list</v-icon>
              </v-btn>
              <span>Create a new Task</span>
            </v-tooltip>
          </v-speed-dial>
          <v-spacer></v-spacer>
            <div class="pt-3 pl-0 case-info" :class="$vuetify.dark ? 'darkColor' : ''">
              <b>Number:</b> ML-0242020-AP <br>
              <b>Case Name:</b> Mark & Letty Livings Adoption <br>
              <b>Name:</b> Mark & Letty Livings
            </div>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            placeholder="Search"
            hide-details
            clearable
            v-on:keyup.enter="getData('TaskGroup', search)"
            @click:clear="getData('TaskGroup')"
            :dark="$vuetify.dark"
          ></v-text-field>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <vue-perfect-scrollbar :class="[ session.user().role !== 'parent' && session.user().role !== 'child' ? 'perfect--scrollbar--task' : 'perfect--scrollbar--task--parent']">
      <v-layout row wrap ma-0 task-cards>
        <template v-if="noResult">
          <v-flex xs12 class="text-xs-center mt-5 pt-5">
            <h3>No groups found</h3>
          </v-flex>
        </template>
        <template v-for="(item, index) in groups">
          <v-flex lg4 sm6 xs12 :key="index + 'group'">
            <v-hover>
              <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 8 : 1}`">
                <v-card-title class="pb-0">
                  <div class="layout row ma-0 justify-space-between pb-1">
                    <h4>{{ item.name }}</h4>
                    <div class="icon">
                      <v-icon left>format_list_bulleted</v-icon>
                    </div>
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-progress-circular
                    :rotate="360"
                    :size="200"
                    :width="15"
                    :value="item.taskValue"
                    color="primary"
                  >
                    <span class="display-1">{{ item.taskValue }}%</span>
                    <span class="caption d-block">{{ item.task.length }} / {{ item.taskTotal }}</span>
                  </v-progress-circular>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat color="primary" dense :to="'/tasks-view/' + item.id">
                    <v-icon left>fas fa-tasks</v-icon>
                    <span>VIEW TASKS</span>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-hover>
          </v-flex>
        </template>
      </v-layout>
    </vue-perfect-scrollbar>
    <v-dialog v-model="dialog_loading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addGroupDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Create a new TaskGroup</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md py-0>
            <v-form ref="addGroup">
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="addGroup.name"
                    prepend-icon="text_fields"
                    label="TaskGroup Name *"
                    hint="The TaskGroup Name."
                    persistent-hint
                    counter
                    maxlength="255"
                    :validate-on-blur="true"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="addGroup.task"
                    label="Tasks *"
                    hint="The tasks of this TaskGroup"
                    prepend-icon="toc"
                    :items="taskItems"
                    :selected="addGroup.task"
                    clearable
                    persistent-hint
                    chips
                    item-text="name"
                    item-value="id"
                    :rules="[rules.required]"
                    required
                    multiple
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="addGroup.group"
                    label="Groups *"
                    hint="Message Groups"
                    prepend-icon="toc"
                    :items="groupsItems"
                    clearable
                    persistent-hint
                    chips
                    item-text="name"
                    item-value="id"
                    :rules="[rules.required]"
                    required
                    multiple
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 pt-2>
                  <small>*indicates required field</small>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeNew()">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="addNew('TaskGroup', 'addGroup', addGroup)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addSubGroupDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Create a new TaskSubGroup</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md py-0>
            <v-form ref="addSubGroup">
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="addSubGroup.name"
                    prepend-icon="text_fields"
                    label="Task SubGroup Name *"
                    hint="The Task SubGroup Name."
                    persistent-hint
                    counter
                    maxlength="255"
                    :validate-on-blur="true"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="addSubGroup.task_group"
                    label="TaskGroup *"
                    hint="TasksGroup associated to this Task SubGroup"
                    prepend-icon="toc"
                    :items="groups"
                    :selected="addSubGroup.task_group"
                    clearable
                    persistent-hint
                    chips
                    item-text="name"
                    item-value="id"
                    :rules="[rules.required]"
                    required
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="addSubGroup.task"
                    label="Tasks *"
                    hint="The tasks of this Task SubGroup"
                    prepend-icon="toc"
                    :items="taskItems"
                    :selected="addSubGroup.task"
                    clearable
                    persistent-hint
                    chips
                    item-text="name"
                    item-value="id"
                    :rules="[rules.required]"
                    required
                    multiple
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete
                    v-model="addSubGroup.group"
                    label="Groups *"
                    hint="Message Groups"
                    prepend-icon="toc"
                    :items="groupsItems"
                    clearable
                    persistent-hint
                    chips
                    item-text="name"
                    item-value="id"
                    :rules="[rules.required]"
                    required
                    multiple
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 pt-2>
                  <small>*indicates required field</small>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeNew()">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="addNew('TaskSubGroup', 'addSubGroup', addSubGroup)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Tasks from './Tasks.vm.js';
export default Tasks;
</script>
<style scoped lang="css">
.task-cards .v-card__text {
  max-height: 240px;
  height: 235px;
  text-align: center;
}
.task-cards .v-card__actions {
  display: block !important;
  text-align: center;
  height: 52px;
}
.perfect--scrollbar--task {
  height: calc(100vh - 200px);
}
.perfect--scrollbar--task--parent {
  height: calc(100vh - 105px);
}
.toolbar--task {
  z-index: 1;
}
.v-step {
  z-index: 2 !important;
}
.case-info {
  margin-left: -100px;
}
.darkColor {
  background-color: #4D4D4D !important;
  color: #ffffff !important;
}
</style>

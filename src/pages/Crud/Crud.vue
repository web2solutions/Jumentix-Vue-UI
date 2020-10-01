<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-toolbar card color="white">
              <v-text-field
                flat
                solo
                prepend-icon="search"
                placeholder="Type something"
                v-model="search"
                hide-details
                class="hidden-sm-and-down"
              ></v-text-field>
              <v-dialog v-model="dialog" max-width="500px">
                <v-btn fab color="primary mb-2" dark slot="activator">
                    <v-icon>person_add</v-icon>
                </v-btn>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12>
                          <v-text-field v-model="editedItem.email" label="E-mail"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field v-model="editedItem.first_name" label="Fisrt Name"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field v-model="editedItem.last_name" label="Last Name"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="headers"
                :items="demoUsers"
                :search="search"
                :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                class="elevation-1"
                >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item._id }}</td>
                  <td>{{ props.item.first_name }}</td>
                  <td>{{ props.item.last_name }}</td>
                  <td>{{ props.item.email }}</td>
                  <td class="justify-center layout px-0">
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </td>
                </template>
                <template v-slot:no-data>
                  <v-btn color="primary" @click="initialize">Reset</v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    search: '',
    headers: [
      {
        text: 'ID',
        align: 'left',
        sortable: false,
        value: '_id'
      },
      { text: 'First Name', value: 'first_name' },
      { text: 'Last Name', value: 'first_name' },
      { text: 'Email', value: 'email' },
      { text: 'Action', value: '', align: 'center' }
    ],
    demoUsers: [],
    editedIndex: -1,
    editedItem: {
      _id: '',
      first_name: '',
      last_name: '',
      email: ''
    },
    defaultItem: {
      _id: '',
      first_name: '',
      last_name: '',
      email: ''
    }
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New User' : 'Edit User';
    }
  },
  watch: {
    dialog (val) {
      val || this.close();
    }
  },
  created () {
    this.initialize();
  },
  methods: {
    initialize () {
      this.demoUsers = [
        {
          _id: '1',
          email: 'alvaro@web2solutions.com',
          first_name: 'Alvaro',
          last_name: 'Andrade'
        },
        {
          _id: '2',
          email: 'eduardo@web2solutions.com',
          first_name: 'Eduardo',
          last_name: 'Almeida'
        },
        {
          _id: '3',
          email: 'mark@web2solutions.com',
          first_name: 'Mark',
          last_name: 'Living'
        },
        {
          _id: '4',
          email: 'Bidsha@web2solutions.com',
          first_name: 'Bidsha',
          last_name: 'Almeida'
        },
        {
          _id: '5',
          email: 'rijin@web2solutions.com',
          first_name: 'Rijin',
          last_name: 'Indian'
        },
        {
          _id: '6',
          email: 'rafeeque@web2solutions.com',
          first_name: 'Rafeeque',
          last_name: 'Indian'
        },
        {
          _id: '7',
          email: 'soumya@web2solutions.com',
          first_name: 'Soumya',
          last_name: 'Indian'
        }
      ];
    },
    editItem (item) {
      this.editedIndex = this.demoUsers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem (item) {
      const index = this.demoUsers.indexOf(item);
      confirm('Are you sure you want to delete this item?') &&
        this.demoUsers.splice(index, 1);
    },
    close () {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.demoUsers[this.editedIndex], this.editedItem);
      } else {
        this.demoUsers.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>

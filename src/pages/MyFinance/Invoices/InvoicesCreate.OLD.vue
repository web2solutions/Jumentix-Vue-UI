<template>
    <v-container id="Invoices">
    <component-menu-nav></component-menu-nav>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row>
          <v-flex xs9>
            <v-card>
                <v-card-title class="pb-0">
                    <v-layout row justify-space-between wrap>
                        <v-flex xs3>

                        </v-flex>
                        <v-flex class="text-xs-right">
                            <v-btn color="red" dark small>
                                <v-icon small left>cancel</v-icon>
                                <span> Cancel</span>
                            </v-btn>
                            <v-btn color="green" dark small>
                                <v-icon small left>save</v-icon>
                                <span> Save</span>
                            </v-btn>
                            <v-btn color="primary" dark small>
                                <v-icon small left>send</v-icon>
                                <span> Send</span>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-title>
                <vue-perfect-scrollbar class="statement--scrollbar">
                    <v-card-text>
                        <v-container fluid grid-list-xl pt-0>
                            <v-layout class="header-statement" row justify-space-between>
                                <v-flex xs12 md4>
                                    <img class="logo" src=".../../../static/logo.png">
                                </v-flex>
                                <v-flex xs12 md4>
                                    <div class="header-address">
                                        <strong>WEB2 SOLUTIONS LLC</strong>
                                        <br>11125 Park Blvd Ste 104-136
                                        <br>Seminole, FL 33772
                                    </div>
                                </v-flex>
                            </v-layout>

                            <v-layout row justify-space-between wrap class="row-1 mt-3">
                                <v-flex xs4>
                                    <h5>Billed To</h5>
                                    <v-btn class="add-client mx-0">
                                        + ADD CLIENT
                                    </v-btn>
                                </v-flex>
                                <v-flex xs4>
                                    <h5>Date of Issue</h5>
                                    <v-dialog
                                        ref="dialog"
                                        v-model="date_issue_pick"
                                        :return-value.sync="date"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="date"
                                            prepend-icon="event"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="date" @input="date_issue_pick = false" scrollable></v-date-picker>
                                    </v-dialog>

                                    <h5>Due Date</h5>
                                    <v-dialog
                                        ref="due_date"
                                        v-model="due_date_pick"
                                        :return-value.sync="date"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="date"
                                            prepend-icon="event"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="date" @input="$refs.due_date.save(date)" scrollable></v-date-picker>
                                    </v-dialog>
                                </v-flex>
                                <v-flex xs4>
                                   
                                    <v-layout row justify-space-between wrap class="col-3">
                                        <v-flex lx6>
                                             <h5>Invoice<br> Number</h5>
                                            0000001
                                             <h5 class="mt-4">Reference</h5>
                                             <p class="overline">Enter value<br> (e.g. PO #)</p>
                                        </v-flex>
                                        <v-flex lx6>
                                            <h5>Amount<br>Due (USD)</h5>
                                            <p class="display-1 font-weight-bold">$0.00</p>
                                        </v-flex>
                                    </v-layout>
                                    
                                </v-flex>
                            </v-layout>

                            <v-layout row justify-space-between wrap mt-4> 
                                <v-flex xs12>
                                    <v-toolbar flat color="white">
                                        
                                        </v-toolbar>
                                        <v-data-table
                                        :headers="headers"
                                        :items="items"
                                        hide-actions
                                        v-sortable-table
                                        @sorted="saveOrder"
                                        >
                                        <template v-slot:items="props">
                                            <td class="px-1" style="width: 0.1%">
                                                <v-btn style="cursor: move" icon class="sortHandle"><v-icon>drag_handle</v-icon></v-btn>
                                            </td>
                                            <td>{{ props.item.name }}</td>
                                            <td class="text-xs-left">{{ props.item.description }}</td>
                                            <td class="text-xs-center">{{ props.item.rate }}</td>
                                            <td class="text-xs-center">{{ props.item.qty }}</td>
                                            <td class="text-xs-center">{{ props.item.total }}</td>
                                            <td class="justify-center layout px-0">
                                            <v-icon
                                                small
                                                class="mr-2"
                                                @click="editItem(props.item)"
                                            >
                                                edit
                                            </v-icon>
                                            <v-icon
                                                small
                                                @click="deleteItem(props.item)"
                                            >
                                                delete
                                            </v-icon>
                                            </td>
                                        </template>
                                        <template v-slot:no-data>
                                            <v-btn color="primary" @click="initialize">Reset</v-btn>
                                        </template>
                                        <template v-slot:footer>
                                            <td :colspan="headers.length">
                                                <v-dialog v-model="dialog" max-width="500px">
                                            <template v-slot:activator="{ on }">
                                                <v-btn color="primary" dark class="mt-3 btn-add" v-on="on">New Item</v-btn>
                                            </template> 
                                            <v-card>
                                            <v-card-title>
                                                <span class="headline">{{ formTitle }}</span>
                                            </v-card-title>

                                            <v-card-text>
                                                <v-container grid-list-md>
                                                <v-layout wrap>
                                                    <v-flex xs12>
                                                    <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12>
                                                    <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs4>
                                                    <v-text-field v-model="editedItem.rate" prefix="$" label="rate"></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs4>
                                                    <v-text-field v-model="editedItem.qty" label="qty"></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs4>
                                                    <v-text-field v-model="editedItem.total" prefix="$" label="total"></v-text-field>
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
                                            </td>
                                        </template>
                                        </v-data-table>
                                </v-flex>
                            </v-layout>

                            <v-layout align-end justify-end row>
                                <v-flex xs12 md5 text-xs-rigth>
                                    <table class="tbl-statement md5" md5>
                                        <tbody>
                                        <tr>
                                            <td>Subtotal:</td>
                                            <td>$ 0.00</td>
                                        </tr>
                                        <tr>
                                            <td>Add a Discount</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>Tax</td>
                                            <td>$ 0.00</td>
                                        </tr>
                                        <tr>
                                            <td>Total</td>
                                            <td>$ 0.00</td>
                                        </tr>
                                        <tr>
                                            <td>Amount Paid</td>
                                            <td>$ 0.00</td>
                                        </tr>
                                        <tr>
                                            <td>Amount Due (USD)</td>
                                            <td>$ 0.00</td>
                                        </tr>
                                        <tr>
                                            <td>Request a Deposit</td>
                                            <td></td>
                                        </tr>
                                        </tbody>
                                    </table>
                               
                                </v-flex>
                            </v-layout>
                            <v-container fluid grid-list-md>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <h5>Notes</h5>
                                        <v-textarea
                                        solo
                                        name="notes"
                                        label="Insert a note"
                                        ></v-textarea>
                                    </v-flex>
                                    <v-flex xs12>
                                        <h5>Terms</h5>
                                        <v-textarea
                                        solo
                                        name="Terms"
                                        label="Enter terms details (optional)"
                                        ></v-textarea>
                                    </v-flex>
                                    <v-flex xs12>
                                       <v-layout row wrap>
                                            <v-flex xs4>
                                                <v-checkbox label="Credit Card"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs4>
                                                <v-checkbox label="Check"></v-checkbox>
                                            </v-flex>
                                            <v-flex xs4>
                                                <v-checkbox label="eCheck"></v-checkbox>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                            <v-layout row wrap>
                                <v-flex class="pdf-footer">
                                <p>User: Adoptions Together | User type: Agency | Agency: 243</p>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                </vue-perfect-scrollbar>
            </v-card>
        </v-flex>
          <v-flex xs4>
              <componet-invoices-list></componet-invoices-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
</template>

<script>
/* eslint-disable */ 
import Statements from '@/api/statements';
import Material from 'vuetify/es5/util/colors';
import MenuNav from '../MenuNav';
import InvoicesList from './InvoicesList.vue';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Sortable from 'sortablejs';
export default {
  components: {
    'component-menu-nav': MenuNav,
    'componet-invoices-list': InvoicesList,
    VuePerfectScrollbar
  },
    data: () => ({
        date: new Date().toISOString().substr(0, 10),
        date_issue_pick: false,
        due_date_pick: false,
        color: Material,
        dialog: false,
      headers: [
        { sortable: false},
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Description', value: 'description', sortable: false },
        { text: 'Rate', value: 'rate', sortable: false },
        { text: 'Qty', value: 'qty', sortable: false },
        { text: 'Line Total', value: 'total', sortable: false },
        { text: 'Actions', value: 'action', sortable: false, sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        description: '',
        rate: '',
        qty: '',
        total: ''
      },
      defaultItem: {
        name: '',
        description: '',
        rate: '',
        qty: '1',
        total: ''
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },
    directives: {
        SortableTable: {
        bind(el, binding, vnode) {
            let sortableElement = el.getElementsByTagName("tbody")[0];
            const options = {
            handle: ".sortHandle",
            animation: 150,
            onUpdate: function(event) {
                vnode.child.$emit("sorted", event);
            },
            };
            Sortable.create(sortableElement, options);
        },
        },
    },
    methods: {
        saveOrder({ oldIndex, newIndex }) {
            const moved = this.items.splice(oldIndex, 1)[0];
            this.items.splice(newIndex, 0, moved);
            console.log("ItemsOrder:", this.items)
        },
      initialize () {
        this.items = [
          {
            name: '2012 Printed Documents',
            description: 'AIRS / JumentiX Usage Charge',
            rate: '6.50',
            qty: '1',
            total: '6.50'
          },
          {
            name: '2014 FAC Support',
            description: 'AIRS Usage Charge',
            rate: '6.50',
            qty: '1',
            total: '6.50'
          },
          {
            name: 'AIRS License',
            description: 'AIRS / JumentiX Usage',
            rate: '6.50',
            qty: '1',
            total: '6.50'
          },
          {
            name: 'AIRS Fee',
            description: 'AIRS / JumentiX Usage Charge',
            rate: '6.50',
            qty: '1',
            total: '6.50'
          },
          {
            name: 'AIRS License Fee',
            description: 'AIRS / JumentiX Charge',
            rate: '6.50',
            qty: '1',
            total: '6.50'
          }
        ]
      },

      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.items.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.items.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.items[this.editedIndex], this.editedItem)
        } else {
          this.items.push(this.editedItem)
        }
        this.close()
      }
    }
  }
</script>

<style scoped>
h5{
    font-weight: bold;
}
.btn-add{
    width: 100%;
}
.tbl-statement,
.tbl-statement tr {
  border-collapse: collapse;
  border-top: 1px solid #dee2e6;
  width: 100%;
}
.tbl-statement td:first-child { font-weight: bold; }
.balance-due {
  border-top: 1px solid #9e9e9e !important;
}
.tbl-statement td,
.tbl-total td {
  padding: 10px 40px 10px 15px;
}
.tbl-statement tr {
  border-top: 1px solid #dee2e6;
}
.to{
  position: relative;
  top: 100px;
}
.range-text{
  border-top: 1px solid #666666;
  border-bottom: 1px solid #666666;
  padding: 5px;
  margin: 15px 0;
}
.pdf-footer {
  position: absolute;
  left: 0.3in;
  right: 0.3in;
  padding-top: 0.05in;
  border-top: 1px solid #e5e5e5;
  font-size: 0.9em;
  text-align: left;
  color: #787878;
}
.logo{
    width: 100%;
}
.add-client{
    width: 100%;
    height: 100%;
}
.header-statement {
  border-bottom: 1px solid #d4d2d2;
  margin: 0 15px;
  padding-bottom: 5px;
}
.header-address{
    vertical-align: bottom;
    margin-top: 33px;
}
.invoice-number {
  text-align: right;
}

</style>

<template>
    <v-container id="Invoices">
    <component-menu-nav></component-menu-nav>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row>
          <v-flex xs12>
            <v-card>
                <v-card-title class="pb-0">
                    <v-layout row justify-space-between wrap>
                        <v-flex xs3>

                        </v-flex>
                        <v-flex class="text-xs-right">
                            <v-btn color="red" dark small to="/invoices">
                                <v-icon small left>cancel</v-icon>
                                <span> Cancel</span>
                            </v-btn>
                            <v-btn color="green" dark small @click="createInvoice">
                                <v-icon small left>save</v-icon>
                                <span> Save</span>
                            </v-btn>
                            <!-- <v-btn color="primary" dark small @click="submit">
                                <v-icon small left>send</v-icon>
                                <span> Send</span>
                            </v-btn> -->
                        </v-flex>
                    </v-layout>
                </v-card-title>
                <vue-perfect-scrollbar class="statement--scrollbar">
                    <v-card-text>
                        <v-form ref="form">
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
                                        <v-card>
                                            <v-card-text>
                                            <v-autocomplete
                                                ref="selectClient"
                                                v-model="drawee"
                                                :items="entriesWallet"
                                                :loading="isLoading"
                                                hide-selected
                                                item-text="Wallet"
                                                item-value="ID"
                                                :label="`${searchClient ? 'Select a Client Wallet' : 'Select a Case'}`"
                                                placeholder="Start typing to Search"
                                                return-object
                                            >
                                            <template v-slot:prepend>
                                                <v-slide-x-reverse-transition
                                                    mode="out-in"
                                                >
                                                    <v-icon
                                                    :key="`icon-${searchClient}`"
                                                    @click="searchClient = !searchClient"
                                                    v-text="searchClient ? 'people_outline' : 'find_in_page'"
                                                    ></v-icon>
                                                </v-slide-x-reverse-transition>
                                            </template>
                                            </v-autocomplete>
                                            </v-card-text>
                                            <v-divider></v-divider>
                                            <v-expand-transition>
                                            <v-list v-if="drawee">
                                                <v-list-tile
                                                v-for="(field, i) in fields"
                                                :key="i"
                                                >
                                                <v-list-tile-content>
                                                    <v-list-tile-sub-title v-text="field.key"></v-list-tile-sub-title>
                                                    <v-list-tile-title v-text="field.value"></v-list-tile-title>
                                                </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list>
                                            </v-expand-transition>
                                            <v-card-actions id="walletAction">
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    :disabled="!drawee"
                                                    @click="drawee = null"
                                                >
                                                    Clear
                                                    <v-icon right>mdi-close-circle</v-icon>
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-flex>
                                    <v-flex xs4>
                                        <h5>Date of Issue</h5>
                                        <v-dialog
                                            ref="date_issue"
                                            v-model="date_issue_pick"
                                            :return-value.sync="date_issue"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                        >
                                            <template v-slot:activator="{ on }">
                                            <v-text-field
                                                v-model="date_issue"
                                                prepend-icon="event"
                                                readonly
                                                v-on="on"
                                            ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="date_issue" @input="$refs.date_issue.save(date_issue)" scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="date_issue_pick = false">Cancel</v-btn>
                                                <v-btn flat color="primary" @click="$refs.date_issue.save(date_issue)">OK</v-btn>
                                            </v-date-picker>
                                        </v-dialog>

                                        <h5>Due Date</h5>
                                        <v-dialog
                                            ref="due_date"
                                            v-model="due_date_pick"
                                            :return-value.sync="due_date"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                        >
                                            <template v-slot:activator="{ on }">
                                            <v-text-field
                                                v-model="due_date"
                                                prepend-icon="event"
                                                readonly
                                                v-on="on"
                                            ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="due_date" :min="date_issue" @input="$refs.due_date.save(due_date)" scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="due_date_pick = false">Cancel</v-btn>
                                                <v-btn flat color="primary" @click="$refs.due_date.save(due_date)">OK</v-btn>
                                            </v-date-picker>
                                        </v-dialog>
                                    </v-flex>
                                    <v-flex xs4>
                                    
                                        <v-layout row justify-space-between wrap class="col-3">
                                            <v-flex lx6>
                                                <h5>Invoice<br> Number</h5>
                                                {{ invoice_number }}
                                                <h5 class="mt-4">Reference</h5>
                                                <p class="overline">Enter value<br> (e.g. PO #)</p>
                                            </v-flex>
                                            <v-flex lx6>
                                                <h5>Amount<br>Due (USD)</h5>
                                                <p class="display-1 font-weight-bold">{{ itemsAmount }}</p>
                                            </v-flex>
                                        </v-layout>
                                        
                                    </v-flex>
                                    <v-flex xs12>
                                        <xSimpleForm
                                            :entity="'Invoice'"
                                            :bus="bus"
                                            key="Invoice"
                                            :hideFields="['drawee', 'due_date', 'billing_address', 'shipping_address', 'file', 'good' ]"
                                            :formData="formData"
                                        ></xSimpleForm>
                                    </v-flex>
                                </v-layout>

                                <v-layout row mt-4> 
                                    <v-flex xs12>
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
                                            <td class="text-xs-center">{{ props.item.type }}</td>
                                            <td class="text-xs-center">{{ props.item.unity }}</td>
                                            <td class="text-xs-center">{{ props.item.unity_price.toLocaleString(session.user.language, { style: 'currency', currency: session.user.currency_code }) }}</td>
                                            <td class="text-xs-center">{{ props.item.quantity }}</td>
                                            <td class="text-xs-center">{{ props.item.amount.toLocaleString(session.user.language, { style: 'currency', currency: session.user.currency_code }) }}</td>
                                            <td class="justify-center">
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
                                                                <v-autocomplete
                                                                    v-model="itemSelected"
                                                                    :items="entriesItem"
                                                                    :loading="isLoading"
                                                                    hide-selected
                                                                    item-text="name"
                                                                    item-value="_id"
                                                                    label="Item"
                                                                    placeholder="Start typing to Search"
                                                                    return-object
                                                                    @input="changeItem"
                                                                    :disabled="itemDisabled"
                                                                ></v-autocomplete>
                                                            </v-flex>
                                                            <v-flex xs7>
                                                                <v-text-field v-model="editedItem.type" label="Good Type" :disabled="true"></v-text-field>
                                                            </v-flex>
                                                            <v-flex xs5>
                                                                <v-text-field v-model="editedItem.unity" label="Unity" :disabled="true"></v-text-field>
                                                            </v-flex>
                                                            <v-flex xs4>
                                                                <v-text-field v-model="editedItem.unity_price" type="number" prefix="$" label="Unity Price" :disabled="true"></v-text-field>
                                                            </v-flex>
                                                            <v-flex xs4>
                                                                <v-text-field v-model="editedItem.quantity" type="number" label="Quantity" @input="amountQnt()"></v-text-field>
                                                            </v-flex>
                                                            <v-flex xs4>
                                                            <v-text-field v-model="editedItem.amount" type="number" prefix="$" label="Amount" :disabled="true"></v-text-field>
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
                                                <td>{{ itemsAmount }}</td>
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
                                                <td>{{ itemsAmount }}</td>
                                            </tr>
                                            <tr>
                                                <td>Amount Paid</td>
                                                <td>$ 0.00</td>
                                            </tr>
                                            <tr>
                                                <td>Amount Due (USD)</td>
                                                <td>{{ itemsAmount }}</td>
                                            </tr>
                                            <tr>
                                                <td>Request a Deposit</td>
                                                <td></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                
                                    </v-flex>
                                </v-layout>
                                <!-- <v-container fluid grid-list-md>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <h5>Notes</h5>
                                            <v-textarea
                                            v-model="customer_notes"
                                            solo
                                            name="notes"
                                            label="Insert a note"
                                            ></v-textarea>
                                        </v-flex>
                                        <v-flex xs12>
                                        <v-layout row wrap>
                                                <v-flex xs4>
                                                    <v-checkbox v-model="payment_options" label="Credit Card" value="Credit Card"></v-checkbox>
                                                </v-flex>
                                                <v-flex xs4>
                                                    <v-checkbox v-model="payment_options" label="Check" value="Check"></v-checkbox>
                                                </v-flex>
                                                <v-flex xs4>
                                                    <v-checkbox v-model="payment_options" label="eCheck" value="eCheck"></v-checkbox>
                                                </v-flex>
                                                <v-flex xs4>
                                                    <v-checkbox v-model="payment_options" label="Wire Transfer" value="Wire Transfer"></v-checkbox>
                                                </v-flex>
                                                <v-flex xs4>
                                                    <v-checkbox v-model="payment_options" label="Cash" value="Cash"></v-checkbox>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex> 
                                    </v-layout>
                                </v-container>-->
                                <v-layout row wrap>
                                    <v-flex class="pdf-footer">
                                    <p>User: {{ session.user.name }} | User type: {{ session.user.role }} | Agency: {{ session.user.agency_id }}</p>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-form>
                    </v-card-text>
                </vue-perfect-scrollbar>
            </v-card>
          </v-flex>
            <v-snackbar
                v-model="snack"
                :timeout="3000"
                :color="snackColor"
                :top="true"
                >
                {{ snackText }}
                <v-btn flat @click="snack = false">Close</v-btn>
            </v-snackbar>
        </v-layout>
      </v-container>
    </v-container>
</template>

<script>
import InvoicesCreate from './InvoicesCreate.vm.js';
export default InvoicesCreate;
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
    width: 60%;
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
#Invoices .v-card__actions {
    display: none;
}
</style>
<style lang="css">
#Invoices .v-card__actions {
    display: none;
}
#walletAction {
    display: flex !important;
}
</style>

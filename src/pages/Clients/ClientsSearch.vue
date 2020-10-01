<template>
    <v-container grid-list-xl fluid id="Sample">
      <v-layout row wrap>
        <vue-perfect-scrollbar class="perfect--scrollbar">
            <v-flex xs12>
                <v-btn color="primary" small to="/users-listing">SEARCH</v-btn>
                <v-btn color="red" dark small>Reset</v-btn>   
            </v-flex>
            <v-flex lg12>
                <v-form>
                    <v-card>
                        <v-container>
                            <v-layout wrap>
                                <v-flex xs12 md6>
                                    <v-autocomplete
                                    v-model="programItemsSelected"
                                    :items="programItems"
                                    chips
                                    label="Program Name "
                                    item-text="name"
                                    item-value="name"
                                    multiple
                                    >
                                    <template v-slot:selection="data">
                                        <v-chip
                                        :selected="data.selected"
                                        small
                                        close
                                        class="chip--select-multi"
                                        @input="removeProgram(data.item)"
                                        >
                                        {{ data.item.name }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:item="data">
                                        <template v-if="typeof data.item !== 'object'">
                                        <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                        </template>
                                        <template v-else>
                                        <v-list-tile-content>
                                            <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                        </v-list-tile-content>
                                        </template>
                                    </template>
                                    </v-autocomplete>
                                </v-flex>

                                <v-flex xs12 md6>
                                    <v-autocomplete
                                        v-model="groupItemsSelected"
                                        :items="groupItems"
                                        chips
                                        color="blue-grey lighten-2"
                                        label="Groups"
                                        item-text="name"
                                        item-value="name"
                                        multiple
                                    >
                                        <template v-slot:selection="data">
                                            <v-chip
                                            :selected="data.selected"
                                            small
                                            close
                                            class="chip--select-multi"
                                            @input="removeGroup(data.item)"
                                            >
                                            {{ data.item.name }}
                                            </v-chip>
                                        </template>
                                        <template v-slot:item="data">
                                            <template v-if="typeof data.item !== 'object'">
                                            <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                            </template>
                                            <template v-else>
                                            <v-list-tile-content>
                                                <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                            </v-list-tile-content>
                                            </template>
                                        </template>
                                    </v-autocomplete>
                                </v-flex>

                                <v-flex xs12 md6>
                                    <v-autocomplete
                                    v-model="assignedItemsSelected"
                                    :items="assingData"
                                    chips
                                    color="blue-grey lighten-2"
                                    label="Assigned To"
                                    item-text="text"
                                    item-value="text"
                                    multiple
                                    >
                                    <template v-slot:selection="data">
                                        <v-chip
                                        :selected="data.selected"
                                        small
                                        close
                                        class="chip--select-multi"
                                        @input="removeAssigned(data.item)"
                                        >
                                        {{ data.item.text }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:item="data">
                                        <template v-if="typeof data.item !== 'object'">
                                        <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                        </template>
                                        <template v-else>
                                        <v-list-tile-content>
                                            <v-list-tile-title v-html="data.item.text"></v-list-tile-title>
                                        </v-list-tile-content>
                                        </template>
                                    </template>
                                    </v-autocomplete>
                                </v-flex>

                                <v-flex xs12 md6>
                                    <v-autocomplete
                                    v-model="caseItemsSelected"
                                    :items="caseData"
                                    chips
                                    color="blue-grey lighten-2"
                                    label="Case Status"
                                    item-text="text"
                                    item-value="text"
                                    multiple
                                    >
                                    <template v-slot:selection="data">
                                        <v-chip
                                        :selected="data.selected"
                                        small
                                        close
                                        class="chip--select-multi"
                                        @input="removeCase(data.item)"
                                        >
                                        {{ data.item.text }}
                                        </v-chip>
                                    </template>
                                    <template v-slot:item="data">
                                        <template v-if="typeof data.item !== 'object'">
                                        <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                        </template>
                                        <template v-else>
                                        <v-list-tile-content>
                                            <v-list-tile-title v-html="data.item.text"></v-list-tile-title>
                                        </v-list-tile-content>
                                        </template>
                                    </template>
                                    </v-autocomplete>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>

                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex v-for="item in form_fields" xs12 md6 :key="item.value + '-flex'">
                            <v-text-field :name="item.value" :label="item.text"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    
                    <v-flex xs12 class="text-xs-center">
                        <v-btn color="primary" to="/clients">SEARCH</v-btn>
                        <v-btn color="red" dark>Reset</v-btn>   
                    </v-flex>
                </v-form>
            </v-flex>
        </vue-perfect-scrollbar> 
      </v-layout>
    </v-container>
</template>
<script>
import ClientsSearch from './ClientsSearch.vm.js';
export default ClientsSearch;
</script>
<style scoped lang="css">
.perfect--scrollbar {
  height: calc(100vh - 130px) !important;
}
</style>

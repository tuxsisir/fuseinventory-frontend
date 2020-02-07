<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h4 class="display-3 grey--text text--darken-2 mb-4">
          Welcome to <span class="blue--text font-weight-bold">fuseInventory</span>
        </h4>

      </v-col>
      <v-col cols="8">
        <v-card>
          <v-card-title>
            Inventory
            <v-spacer></v-spacer>
            <v-btn @click="inventoryFormDialog = true" icon fab small>
              <v-icon small>mdi-plus</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-tabs>
              <v-tab>Consumable</v-tab>
              <v-tab>Non Consumable</v-tab>
            </v-tabs>
            <v-data-table
              :headers="headers"
              :items="inventoryList"
              class="elevation-1"
              hide-default-footer
              >
              <template slot="item"
                        slot-scope="props">
                <tr>
                  <td>
                    {{ props.item.name }}
                    <div>{{ props.item.inventoryType }}</div>
                  </td>
                  <td>{{ props.item.description }}</td>
                  <td>{{ props.item.quantity }}</td>
                  <td>
                    <v-btn small fab icon class="mr-1" @click="triggerUpdate(props.item)">
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn small fab icon @click="deleteInventory(props.item)">
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title>
            Logs
          </v-card-title>
          <v-divider></v-divider>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-dialog v-model="inventoryFormDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Inventory Form</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="formValues.name" label="Item Name *" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="formValues.description" label="Item Description *" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="formValues.quantity"
                      type="number"
                      min="1"
                      label="Quantity *"
                      required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="formValues.inventoryType"
                      :items="[`Consumable`, `Non-Consumable`]"
                      label="Type *"
                      required
                      ></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="inventoryFormDialog = false">Close</v-btn>
              <v-btn color="blue darken-1" text @click="getFormAction()">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      snackbar: false,
      snackbarText: '',
      loading: false,
      formValues: {},
      inventoryFormDialog: false,
      inventoryList: [],
      paginationParams: {
        page: 0,
        size: 10,
      },
      results: {},
      headers: [
        { text: 'Name', value: 'name', sortable: false },
        { text: 'Description', value: 'description', sortable: false },
        { text: 'Quantity', value: 'quantity', sortable: false },
        { text: 'Action', sortable: false },
      ],
    };
  },
  watch: {
    inventoryFormDialog(val) {
      if (!val) {
        this.formValues = {};
      }
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    getFormAction() {
      if (this.formValues.id) {
        return this.updateInventory();
      }
      return this.createInventory();
    },
    fetchData() {
      this.loading = true;
      axios.get('http://localhost:9999/inventory', { params: this.paginationParams })
        .then((resp) => {
          console.log(resp);
          this.inventoryList = resp.data.content;
          this.results = resp.data;
        })
        .catch((err) => {
          console.log(err);
        });
      this.loading = false;
    },
    createInventory() {
      this.loading = true;
      axios.post('http://localhost:9999/inventory', this.formValues)
        .then(() => {
          this.formValues = {};
          this.inventoryFormDialog = false;
          this.fetchData();
          this.snackbarText = 'Success! Created Inventory.';
          this.snackbar = true;
        })
        .catch((err) => {
          console.log(err);
        });
      this.loading = false;
    },
    triggerUpdate(inventory) {
      this.formValues = inventory;
      this.inventoryFormDialog = true;
    },
    updateInventory() {
      this.loading = true;
      const updateUrl = `http://localhost:9999/inventory/${this.formValues.id}`;
      axios.put(updateUrl, this.formValues)
        .then(() => {
          this.formValues = {};
          this.inventoryFormDialog = false;
          this.fetchData();
          this.snackbarText = 'Success! Updated inventory.';
          this.snackbar = true;
        })
        .catch((err) => {
          console.log(err);
        });
      this.loading = false;
    },
    deleteInventory(inventory) {
      this.loading = true;
      const deleteUrl = `http://localhost:9999/inventory/${inventory.inventoryId}`;
      axios.delete(deleteUrl)
        .then(() => {
          this.formValues = {};
          this.fetchData();
          this.snackbarText = 'Success! Deleted inventory.';
          this.snackbar = true;
        })
        .catch((err) => {
          console.log(err);
        });
      this.loading = false;
    },
  },
};
</script>

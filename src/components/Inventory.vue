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
              :items="inventoryList"
              class="elevation-1"
              hide-default-footer
              hide-default-header
              ></v-data-table>
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
                    <v-text-field v-model="formValues.username" label="User Name *" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="formValues.fullName" label="Full Name *" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="formValues.email" label="Email *" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="formValues.gender"
                      :items="['Male', 'Female']"
                      label="Gender *"
                      required
                      ></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="userFormDialog = false">Close</v-btn>
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
      loading: false,
      formValues: {},
      inventoryFormDialog: false,
      inventoryList: [],
      paginationParams: {
        page: 0,
        size: 10,
      },
      results: {},
    };
  },
  methods: {
    fetchData() {
      this.loading = true;
      axios.get('http://localhost:9999/inventory', { params: this.paginationParams })
        .then((resp) => {
          this.inventoryList = resp.data.content;
          this.results = resp.data;
        })
        .catch((err) => {
          console.log(err);
        });
      this.loading = false;
    },
  },
};
</script>

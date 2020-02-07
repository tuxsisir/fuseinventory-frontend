<template>
  <v-container>
    <v-row>
      <v-col cols="12" align="center">
        <h4 class="display-3 grey--text text--darken-2 mb-4">
          Welcome to <span class="blue--text font-weight-bold">fuseInventory</span>
        </h4>
          <v-card>
            <v-card-title>
              Please select user to continue.
              <v-spacer></v-spacer>
              <v-btn @click="userFormDialog = true" icon fab small>
                <v-icon small>mdi-plus</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <!-- Pagination -->
              <div v-if="!loading" class="d-flex">
                <v-btn :disabled="paginationParams.page === 0" @click="paginationParams.page--" fab icon small>
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn :disabled="(results.totalPages - 1) === paginationParams.page"
                  @click="paginationParams.page++" fab icon small>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <p> Total Users: {{ results.totalElements }} / Page: {{ paginationParams.page + 1 }}
                  of {{ results.totalPages }}</p>
              </div>
              <!-- / Pagination -->
              <div class="d-flex flex-wrap justify-center">
                <div v-for="(user, index) in usersList" :key="index">
                  <a class="mx-3" @click="selectedUser = user">
                <v-avatar size="120">
                  <v-img
                    :src="user.gender === `Male` ? `/images/male.png` : `/images/female.png`"
                  ></v-img>
                </v-avatar>
                  </a>
                  <p
                    class="my-1"
                    :class="selectedUser.id === user.id ? `font-weight-bold blue--text subtitle-1` : ``"
                  >
                    {{ user.fullName }}
                  </p>
                  <p>{{ user.email }}</p>
                  <v-icon @click="triggerUpdate(user)" small class="mb-3 grey--text">mdi-pencil</v-icon>
                  <v-icon @click="deleteUser(user)" small class="mb-3 grey--text">mdi-delete</v-icon>
                </div>
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="getStarted()"
                :disabled="Object.keys(selectedUser).length === 0"
                class="primary my-2">
                Let's get started
              </v-btn>
            </v-card-actions>
          </v-card>
      </v-col>
      <v-col cols="12">
        <v-dialog v-model="userFormDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">User Form</span>
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
   <v-snackbar
      v-model="snackbar"
      color="info"
    >
      {{ snackbarText }}
      <v-btn
        color="white"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
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
      usersList: [],
      loading: false,
      userFormDialog: false,
      formValues: {},
      selectedUser: {},
      results: {},
      paginationParams: {
        page: 0,
        size: 14,
      },
    };
  },
  watch: {
    userFormDialog(val) {
      if (!val) {
        this.formValues = {};
      }
    },
    'paginationParams.page': function () {
      this.fetchData();
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    getFormAction() {
      if (this.formValues.id) {
        return this.updateUser();
      }
      return this.createUser();
    },
    fetchData() {
      this.loading = true;
      axios.get('http://localhost:9999/users', { params: this.paginationParams })
        .then((resp) => {
          console.log(resp);
          this.usersList = resp.data.content;
          this.results = resp.data;
        })
        .catch((err) => {
          console.log(err);
        });
      this.loading = false;
    },
    createUser() {
      this.loading = true;
      axios.post('http://localhost:9999/user', this.formValues)
        .then(() => {
          this.formValues = {};
          this.userFormDialog = false;
          this.fetchData();
          this.snackbarText = 'Success! Created User.';
          this.snackbar = true;
        })
        .catch((err) => {
          console.log(err);
        });
      this.loading = false;
    },
    updateUser() {
      this.loading = true;
      const updateUrl = `http://localhost:9999/user/${this.formValues.id}`;
      axios.put(updateUrl, this.formValues)
        .then(() => {
          this.formValues = {};
          this.userFormDialog = false;
          this.fetchData();
          this.snackbarText = 'Success! Updated User.';
          this.snackbar = true;
        })
        .catch((err) => {
          console.log(err);
        });
      this.loading = false;
    },
    triggerUpdate(user) {
      this.formValues = user;
      this.userFormDialog = true;
    },
    deleteUser(user) {
      this.loading = true;
      const deleteUrl = `http://localhost:9999/user/${user.id}`;
      axios.delete(deleteUrl)
        .then(() => {
          this.formValues = {};
          this.fetchData();
          this.snackbarText = 'Success! Deleted User.';
          this.snackbar = true;
        })
        .catch((err) => {
          console.log(err);
        });
      this.loading = false;
    },
    getStarted() {
      this.$router.push({
        name: 'inventory',
        query: { user: this.selectedUser.id },
      });
    },
  },
};
</script>

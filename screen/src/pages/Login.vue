<template>
  <div class="content">
    <div class="container-fluid" style="background-color: lightblue">
      <div class="center-screen">
        <v-card
          v-if="err"
          style="background-color: #edd2d1"
          class="border border-danger rounded text-center"
        >
          <div>
            <h4 slot="header" class="card-title">You are not logged in</h4>
            <p>Please log in first</p>
          </div>
        </v-card>

        <v-card class="p-4">
          <v-card-title class="text-center">Login</v-card-title>
          <v-form
            class="p-4"
            ref="loginForm"
            v-model="logButton"
            lazy-validation
          >
            <div class="row">
              <v-icon class="mr-2">mdi-account</v-icon>
              <v-text-field
                v-model="username"
                :rules="rules"
                label="Username"
                type="text"
                placeholder=""
                required
              />
            </div>
            <div class="row">
              <v-icon class="mr-2">mdi-lock</v-icon>
              <v-text-field
                v-model="password"
                :rules="rules"
                label="Password"
                type="password"
                placeholder=""
                required
              />
            </div>
            <div class="mt-4">
              <v-row>
                <v-col>
                  <v-btn
                    color="success"
                    :disabled="!logButton"
                    @click.prevent="login()"
                  >
                    Login
                  </v-btn>
                </v-col>
                <v-col>
                  <v-dialog
                    v-model="register_dialog"
                    persistent
                    max-width="600px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark v-on="on">Register</v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">User Profile</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-form
                            ref="registerForm"
                            v-model="regButton"
                            lazy-validation
                          >
                            <v-row>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  label="First Name"
                                  :rules="rules"
                                  v-model="firstname"
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  label="Family Name"
                                  :rules="rules"
                                  v-model="lastname"
                                  required
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  label="Username"
                                  :rules="rules"
                                  v-model="new_username"
                                  required
                                  hint="You will login using this"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  label="Password"
                                  type="password"
                                  :rules="rules"
                                  v-model="new_password"
                                  required
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-form>
                        </v-container>
                        <p>
                          This form is created for easy and quick registration
                        </p>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="register_dialog = false"
                          >Close</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          :disabled="!regButton"
                          @click.prevent="register()"
                          >Register</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-row>
            </div>
          </v-form>
          <div class="mt-4 float-right">
            <h6>{{ versionB }}</h6>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
import userApi from "@/api/users_api.js";
import userClass from "@/model/users_class.js";
// import { CONST } from "src/api/const";
// const url = CONST.CONST_URL.concat("/users/");

export default {
  data() {
    return {
      register_dialog: false,
      rules: [v => !!v || "Required!"],
      logButton: false,
      regButton: false,
      password: "",
      username: "",
      versionB: "",
      error: "",
      err: this.$route.query.err,

      firstname: null,
      lastname: null,
      new_username: null,
      new_password: null
    };
  },
  async created() {
    try {
      let check_logged = await userApi.check_logged();
      console.log("Check Login: ", check_logged);
      if (!check_logged.err) {
        this.$router.push("/main");
      }
      this.versionB = await userApi.versionB();
    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {
    async login() {
      this.$refs.loginForm.validate();
      if (this.username && this.password) {
        try {
          const log = await userApi.login(this.username.trim(), this.password);
          console.log("User Login");
          if (log.err) {
            alert(log.err);
          } else {
            this.$router.push("/main");
          }
        } catch (err) {
          this.error = err.message;
        }
      }
    },
    async register() {
      this.$refs.registerForm.validate();
      if (
        this.new_username &&
        this.new_password &&
        this.firstname &&
        this.lastname
      ) {
        const userObj = new userClass();
        userObj.username = this.new_username;
        userObj.password = this.new_password;
        userObj.firstname = this.firstname;
        userObj.lastname = this.lastname;
        console.log(userObj);

        try {
          const register = await userApi.register(userObj.toJson());
          console.log(register)
          if (register.err) {
            alert("Something went wrong. Please try again");
          } else {
            alert(
              "You have succesfully registered. Please log in using your username and password"
            );
            this.$refs.registerForm.reset();
            this.register_dialog = false;
          }
        } catch (err) {
          alert(err);
        }
      }
    }
  },
  watch: {
    register_dialog() {
      this.$refs.registerForm.reset();
    }
  }
};
</script>
<style>
.center-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
}
</style>

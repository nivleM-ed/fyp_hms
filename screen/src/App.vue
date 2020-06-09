<template>
  <v-app>
    <v-content>
      <router-view
        :user.sync="user"
        v-on:checkLogged="checkLogged"
      ></router-view>
    </v-content>
  </v-app>
</template>
<script>
import userClass from "@/js/users_class.js";
export default {
  name: "App",
  data: () => ({
    user: null,
    userObj: null,
  }),
  methods: {
    async checkLogged() {
      this.userObj = new userClass();
      try {
        let check_logged = await this.userObj.check_logged();
        console.log("CHECK LOGGED:", check_logged.id);
        if (!check_logged.err) {
          this.user = check_logged;
        } else if (check_logged.err == "notLoggedIn") {
          this.$router.push("/?err=notLoggedIn");
        }
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/index.scss";
</style>

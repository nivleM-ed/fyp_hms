<template>
  <v-toolbar>
    <v-btn icon @click.prevent="$router.go(-1)" class="hidden-xs-only">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title>Home Management System</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu
      top
      :close-on-content-click="closeOnContentClick"
      offset-x
      offset-y
      left
      bottom
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" class="mr-2">
          <v-badge
            :value="notifications.length > 0"
            color="pink"
            :content="notifications.length"
          >
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in notification"
          :key="index"
          @click="goToPage(item.page)"
        >
          <v-list-item-title
            >Task Scheduled: {{ item.details.name }}
            <span class="font-italic font-weight-light caption"><br/>{{item.details.timeToNotify}}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- <v-btn icon class="mr-2">
      <v-badge
          :value="notifications.length > 0"
          color="pink"
          :content="notifications.length"
        >
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      
    </v-btn> -->
    <v-btn color="red" depressed @click.prevent="logout">
      Logout
      <v-icon>mdi-logout-variant</v-icon>
    </v-btn>
    <!-- 
    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn> -->
  </v-toolbar>
</template>
<script>
import userApi from "@/api/users_api.js";

export default {
  data() {
    return {
      notification: [{ title: "Click Me" }],
      closeOnContentClick: true
    };
  },
  props: ["notifications"],
  methods: {
    async logout() {
      try {
        let logout = await userApi.logout();
        if (logout.err) {
          console.log(logout);
        } else {
          this.$router.push("/");
        }
      } catch (err) {
        alert(err);
      }
    },
    goToPage(page) {
      const tmp = "/main/" + page;
      this.$router.push(tmp);
    }
  },
  watch: {
    notifications() {
      this.notification = [];
      for (var i = 0; i < this.notifications.length; i++) {
        const msg = "You have tasks scheduled";
        const page = "task_ov";
        this.notification.push({
          msg: msg,
          page: page,
          details: this.notifications[i]
        });
        console.log(this.notification);
      }
    }
  }
};
</script>

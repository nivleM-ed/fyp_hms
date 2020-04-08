<template>
  <nav>
    <v-navigation-drawer app permanent expand-on-hover update:mini-variant="drawer">
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="icons/favicon.ico"></v-img>
        </v-list-item-avatar>
        <v-list-item-title>{{ username }}</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="toPage(item.link)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title><v-badge
          :value="notifications.length > 0 && item.title === 'Task'"
          color="pink"
          :content="notifications.length"
        >
          {{item.title}}
        </v-badge></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!-- <template v-slot:append>
        <v-list>
          <v-list-item>
            <v-list-item-content>
                <v-btn color="error" block @click.prevent="logout">Logout</v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template> -->
    </v-navigation-drawer>
  </nav>
</template>

<script>
import userApi from "@/api/users_api.js";

export default {
  data() {
    return {
      // drawer: null,
      username: "User",
      drawer: false,
      mini: true,
      items: [
        { title: "Overview", icon: "mdi-home-circle", link: "/main/overview" },
        {
          title: "Task",
          icon: "mdi-clipboard-list-outline",
          link: "/main/task_ov"
        },
        {
          title: "Inventory",
          icon: "mdi-inbox-multiple-outline",
          link: "/main/inv_ov"
        },
        {
          title: "Expenses",
          icon: "mdi-account-group-outline",
          link: "/main/expense_ov"
        }
      ]
    };
  },
  methods: {
    toPage(page) {
      // const tmp = "/main/" + page;
      this.$router.push(page);
    },
    async logout() {
      try {
        let logout = await userApi.logout();
        if(logout.err) {
          console.log(logout)
        } else {
          this.$router.push("/");
        }
      } catch (err) {
        alert(err)
      }
    }
  },
  props: ["notifications"],
  watch: {
    drawer() {
      console.log(this.drawer)
    }
  }
};
</script>

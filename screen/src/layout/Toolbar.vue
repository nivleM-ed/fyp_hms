<template>
  <v-toolbar flat>
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
          <v-badge :value="notifyNum > 0" color="pink" :content="notifyNum">
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-card flat min-width="300px">
        <v-card-text>
          <v-list v-if="notification.length != 0">
            <v-list-item
              v-for="(item, index) in notification"
              :key="index"
              @click="goToPage(item)"
            >
              <template>
                <v-list-item-content>
                  <v-list-item-title v-on:mouseover="setSeen(index)"
                    >{{ item.msg }}: {{ utils.toFirstUpperCaseInner(item.name) }}
                    <span class="font-italic font-weight-light caption"
                      ><br />{{ utils.momentFormatDate(false, item.date) }}</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </template>
            </v-list-item>
          </v-list>
          <p v-else>You have no notification</p>
        </v-card-text>
      </v-card>
    </v-menu>
    <v-btn color="red" depressed @click.prevent="logout">
      Logout
      <v-icon>mdi-logout-variant</v-icon>
    </v-btn>
  </v-toolbar>
</template>
<script>
import userApi from "@/api/users_api.js";
import notificationClass from "@/js/notification.js";
import utils from "@/js/utils.js";

export default {
  data() {
    return {
      notification: [],
      closeOnContentClick: true,
      notifyNum: [],
      notifyObj: new notificationClass(),
      utils: utils
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
    goToPage(item) {
      const tmp = "/main/" + item.page;
      this.$router.push(tmp);
    },
    async getUnseen() {
      try {
        let tmp = [];
        if (this.notification) {
          for (var i = 0; i < this.notification.length; i++) {
            if (!this.notification[i].seen) tmp.push(i);
          }
        }
        this.notifyNum = tmp.length;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    async setSeen(index) {
      setTimeout(async () => {
        if (!this.notification[index].seen) {
          this.notifyObj = new notificationClass();
          this.notification = await this.notifyObj.setSeen(
            this.notification[index]
          );
          await this.getUnseen();
        }
      }, 500);
    },
  },
  watch: {
    notifications(val) {
      if (val) {
        this.notification = val;
        this.getUnseen();
      }
    },
  },
};
</script>

<template>
  <v-card flat height="70">
    <v-footer absolute class="font-weight-medium">
      <v-col>
        <router-link style="color: black" :to="{ path: '/main' }"
          >Home System {{ versionF }}/{{ versionB }}</router-link
        >
      </v-col>
      <v-col class="text-right">
        {{ timestamp }}
        {{ new Date().getFullYear() }} — <strong>HMS</strong>
      </v-col>
    </v-footer>
  </v-card>
</template>

<script>
import userClass from "@/js/users_class.js";
import {CONST} from "@/js/const.js"

export default {
  data() {
    return {
      versionF: null,
      versionB: null,
    };
  },
  props: ["timestamp"],
  async created() {
    let userObj = new userClass();
    this.versionB = await userObj.versionB();
    this.versionF = CONST.versionF;
  },
  methods: {},
};
</script>

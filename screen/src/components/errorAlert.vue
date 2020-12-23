<template>
  <v-dialog v-model="visible" width="500">
    <v-card>
      <v-card-title class="headline red lighten-2" primary-title>
        Error
      </v-card-title>

      <v-card-text>
        <p class="mt-4 subtitle-1"><b>Error: Network Error</b></p>
        <p class="mt-4 subtitle-1"><b>If you see this error, please inform the developer how this error happened. Thanks!</b></p>
        <p class="mt-4 subtitle-1">{{ error }}</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="goTo()">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
// import utils from "@/js/utils.js";
export default {
  data() {
    return {
      visible: false,
    };
  },
  props: ["error"],
  async created() {},
  methods: {
    goTo() {
      this.$router.push("/login");
      this.visible = false
    }
  },
  watch: {
    error(val) {
      console.log(val);
      try {
        this.visible = true;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

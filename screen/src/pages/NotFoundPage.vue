<template>
  <v-container>
    <v-card flat class="text-center" min-height="500px">
      <v-img src="img/thinking_gif.gif" contain :height="height"></v-img>
    </v-card>
    <div class="text-center">
      <p class="m-4">CANNOT FIND THE PAGE YOU WANTED</p>
      <v-btn color="green" @click="$router.push('/main/')"
        >Return to Homepage</v-btn
      >
    </div>
  </v-container>
</template>

<style></style>
<script>
export default {
  data() {
    return {
      height: 100,
      token: true,
      troller: null
    };
  },
  async created() {
    this.troll();
  },
  methods: {
    troll() {
      this.troller = setInterval(() => {
        if (this.token) {
          if (this.height == 400) {
            this.token = false;
          } else {
            this.height += 1;
          }
        } else {
          if (this.height == 100) {
            this.token = true;
          } else {
            this.height -= 1;
          }
        }
      }, 10);
    },
  },
  destroyed() {
    clearInterval(this.troller)
  }
};
</script>

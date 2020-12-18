<template>
  <v-container>
    <v-expand-transition>
      <v-card
        v-show="selectedExpInner"
        v-if="selectedExpInner"
        outlined
        height="65vh"
        max-width="45vw"
      >
        <v-img class="white--text align-end" height="200px" :src="imgSrc">
          <!-- <div class="fill-height bottom-gradient"></div> -->
          <v-card-title class="display-2 font-weight-medium">
            <v-sheet color="rgba(0, 0, 0, .6)" dark class="p-2">{{
              utils.toFirstUpperCase(selectedExpInner.title, false)
            }}</v-sheet></v-card-title
          >
        </v-img>
        <div
          v-if="selectedExpInner"
          class="flex-column mb-6 ma-4"
          height="100%"
        >
          <v-sheet color="rgba(0, 0, 0, .12)" class="p-3" min-height="100px">
            <div class="mb-auto">
              <b>Title: </b>
              {{ utils.toFirstUpperCase(selectedExpInner.title, false) }} <br />
              <b>Description: </b>{{ selectedExpInner.description }} <br />
              <span v-if="selectedExpInner.money_in">
                <b>Received: </b>
                <v-icon color="green darken-2">
                  mdi-plus
                </v-icon>
                RM {{ selectedExpInner.amount }}
              </span>
              <span v-else>
                <b>Spend: </b>
                <v-icon color="red darken-2">
                  mdi-minus
                </v-icon>
                RM {{ selectedExpInner.amount }}
              </span>
              <br />
              <span>
                <b>Date created: </b
                >{{
                  utils.momentFormatDate(true, new Date(selectedExpInner.date))
                }}
              </span>
              <br />
              <span><b>Category:</b> {{ selectedExpInner.category }}</span>
            </div>
          </v-sheet>
        </div>
        <v-card-actions>
          <v-btn
            class="mr-2"
            color="orange"
            dark
            @click.prevent="updateButton()"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </v-container>
</template>
<script>
import utils from "@/js/utils.js";
export default {
  name: "viewExpense",
  data() {
    return {
      utils: utils,
      imgSrc: null,
    };
  },
  props: ["selectedExpInner"],
  async created() {},
  methods: {
    async updateButton() {
      this.$emit("updateButton");
    },
  },
  watch: {
    selectedExpInner(val) {
      if (val) {
        switch (val.category) {
          case "Transportation":
            this.imgSrc = "img/transportation.jpg";
            break;
          case "Food":
            this.imgSrc = "img/food.jpg";
            break;
          case "Utilities":
            this.imgSrc = "img/utilities.jpg";
            break;
          case "Insurance":
            this.imgSrc = "img/insurance.jpg";
            break;
          case "Housing":
            this.imgSrc = "img/housing.jpg";
            break;
          case "Healthcare":
            this.imgSrc = "img/healthcare.jpg";
            break;
          case "Entertainment":
            this.imgSrc = "img/entertainment.jpg";
            break;
          case "Miscellaneous":
            this.imgSrc = "img/miscellaneous.jpg";
            break;
          case "Recurring Payment":
            this.imgSrc = "img/rec_pay.jpg";
            break;
        }
      }
    },
  },
};
</script>
<style></style>

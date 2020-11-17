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
          <v-card-title class="display-2 font-weight-medium">{{
            utils.toFirstUpperCase(selectedExpInner.title, false)
          }}</v-card-title>
        </v-img>
        <div
          v-if="selectedExpInner"
          class="d-flex align-start flex-column mb-6 ma-4"
          height="100%"
        >
          <div class="mb-auto">
            <p>{{ selectedExpInner.description }}</p>
            <p v-if="selectedExpInner.money_in">
              Received:
              <v-icon color="green darken-2">
                mdi-plus
              </v-icon>
              RM {{ selectedExpInner.amount }}
            </p>
            <p v-else>
              Spend:
              <v-icon color="red darken-2">
                mdi-minus
              </v-icon>
              RM {{ selectedExpInner.amount }}
            </p>
            <p>
              {{
                utils.momentFormatDate(false, new Date(selectedExpInner.date))
              }}
            </p>
            <p>Category: {{ selectedExpInner.category }}</p>
          </div>
          <div class="mb-auto">
            <div class="align-self-end">
              <div>
                <v-btn
                  class="mr-2"
                  color="orange"
                  dark
                  @click.prevent="updateButton()"
                >
                  Update
                </v-btn>
              </div>
            </div>
          </div>
        </div>
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

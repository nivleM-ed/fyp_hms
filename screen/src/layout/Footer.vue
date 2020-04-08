<template>
    
    <v-card flat height="70">
      <v-footer absolute class="font-weight-medium" >
      <v-col>
        <router-link style="color: black" :to="{ path: '/main' }"
          >Home System {{ versionF }}/{{ versionB }}</router-link
        >
      </v-col>
      <v-col class="text-right">
        {{timestamp}}
        {{ new Date().getFullYear() }} — <strong>HMS</strong>
      </v-col>
    </v-footer>
    </v-card>
</template>

<script>
export default {
  data() {
    return {
      versionF: null,
      versionB: null
    };
  },
  props: ['timestamp'],
  methods: {}
};
</script>

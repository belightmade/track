<template>
  <v-card width="200" flat>
    <v-card>
      <v-img :src="coverSrc" height="200" class="align-end">
        <v-card-title class="justify-end">
          <v-btn color="white" icon @click="$emit('click-play')"
            ><v-icon style="text-shadow: 0 0 4px grey;" x-large
              >mdi-play</v-icon
            ></v-btn
          >
        </v-card-title>
      </v-img>
    </v-card>

    <v-card-title>{{ name }}</v-card-title>
    <v-card-subtitle>{{ artist }}</v-card-subtitle>
  </v-card>
</template>

<script>
// import { ref } from 'nuxt-composition-api'
export default {
  props: {
    coverSrc: { type: String, default: '' },
    name: { type: String, default: '' },
    artist: { type: String, default: '' },
  },
  setup(props, { emit }) {},
}
</script>

<style></style>

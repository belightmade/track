<template>
  <v-app>
    <v-app-bar color="white" class="pa-2" fixed app flat>
      <v-btn
        style="font-size: 40px;"
        text
        @click="$router.push('/main')"
        v-text="title"
      ></v-btn>

      <v-spacer></v-spacer>

      <v-btn v-for="item in items" :key="item.title" :to="item.to" text link>
        {{ item.title }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { reactive, toRefs } from 'nuxt-composition-api'

export default {
  name: 'DefaultLayout',
  setup() {
    const state = reactive({
      title: 'Track',
      drawer: false,
      items: [
        { icon: 'mdi-account', title: 'Main', to: 'main' },
        { icon: 'mdi-account', title: 'Upload', to: 'upload' },
      ],
    })

    return {
      ...toRefs(state),
    }
  },
}
</script>

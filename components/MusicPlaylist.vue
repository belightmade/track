<template>
  <v-navigation-drawer
    :value="value"
    width="400"
    color="black"
    right
    dark
    app
    hide-overlay
    @input="(newVal) => $emit('input', newVal)"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="d-flex">
          <v-flex class="text-h5 pa-2">재생목록</v-flex>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <draggable
        v-model="tempPlaylist"
        v-bind="dragOptions"
        @start="dragging = true"
        @end="dragging = false"
      >
        <transition-group
          type="transition"
          :name="!dragging ? 'flip-list' : null"
        >
          <v-list-item
            v-for="(music, index) in tempPlaylist"
            :key="music.id"
            class="pa-4"
            link
            @click="$emit('click-music', music)"
          >
            <v-layout class="white--text" xs4 fill-height align-center>
              <v-card color="transparent" width="52" class="mr-4">
                <v-img :src="getCoverSrc(music)" aspect-ratio="1"></v-img>
              </v-card>
              <div>
                <div>{{ music.name }}</div>
                <div>{{ music.artist && music.artist.name }}</div>
              </div>
            </v-layout>

            <v-list-item-content>
              <v-flex class="text-right">
                <v-spacer></v-spacer>

                <v-btn color="grey" icon @click.stop="addPlaylistDialog = true"
                  ><v-icon>mdi-folder-plus-outline</v-icon></v-btn
                >

                <!-- 더보기 -->
                <v-menu>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="grey" icon v-bind="attrs" v-on="on"
                      ><v-icon>mdi-dots-vertical</v-icon></v-btn
                    >
                    <v-btn
                      color="error darken-2"
                      icon
                      @click.stop="onClickDelete(index)"
                      ><v-icon>mdi-delete-outline</v-icon></v-btn
                    >
                  </template>
                  <v-list dense nav>
                    <v-list-item link>
                      <v-list-item-icon>
                        <v-icon>mdi-music</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>곡정보</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item link>
                      <v-list-item-icon>
                        <v-icon>mdi-record-circle-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>앨범정보</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item link>
                      <v-list-item-icon>
                        <v-icon>mdi-microphone-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>아티스트정보</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item link>
                      <v-list-item-icon>
                        <v-icon>mdi-heart-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>좋아요</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-flex>
            </v-list-item-content>
          </v-list-item>
        </transition-group>
      </draggable>
    </v-list>

    <v-dialog v-model="addPlaylistDialog" width="600">
      <v-card>
        <v-card-title
          >내 리스트에 담기 <v-spacer></v-spacer>
          <v-btn icon @click="addPlaylistDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn></v-card-title
        >
        <v-card-text>
          <v-list>
            <v-list-item link>
              <v-list-item-icon>
                <v-btn
                  width="80"
                  height="80"
                  class="blue--text text-h2"
                  depressed
                  >+</v-btn
                >
              </v-list-item-icon>
              <v-list-item-content class="blue--text text-h6">
                새로운 리스트 추가하기
              </v-list-item-content>
            </v-list-item>

            <v-divider class="grey--text"></v-divider>

            <v-list-item> </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
import { reactive, toRefs, computed } from 'nuxt-composition-api'
import draggable from 'vuedraggable'

export default {
  components: { draggable },
  props: {
    value: { type: Boolean, default: false },
    playlist: {
      type: Array,
      default() {
        return []
      },
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      addPlaylistDialog: false,
      editing: false,
      dragging: false,
    })
    const getCoverSrc = (music) =>
      music?.files?.find((file) => file.role === 'cover')?.location

    const tempPlaylist = computed({
      get: () => props.playlist,
      set: (newPlaylist) => emit('save-playlist', newPlaylist),
    })

    function onClickDelete(index) {
      tempPlaylist.value.splice(index, 1)
    }

    const dragOptions = computed(() => ({
      animation: 200,
      group: 'description',
      disabled: false,
      ghostClass: 'ghost',
    }))

    return {
      ...toRefs(state),
      getCoverSrc,
      onClickDelete,
      tempPlaylist,
      dragOptions,
    }
  },
}
</script>

<style></style>

<template>
  <v-layout
    class="pa-4 mx-n4 my-n2 black"
    row
    justify-space-between
    align-center
  >
    <v-layout class="white--text" xs4 fill-height align-center>
      <v-card color="transparent" width="40" class="mr-4">
        <v-img :src="coverSrc" aspect-ratio="1"></v-img>
      </v-card>
      <div>
        <div>{{ name }}</div>
        <div>{{ artist }}</div>
      </div>
    </v-layout>

    <v-layout class="text-center white--text" xs4 row fill-height align-center>
      <v-flex xs12>
        <v-btn
          dark
          icon
          :class="[repeatActive ? '' : 'grey--text']"
          @click="$emit('repeat')"
          ><v-icon>{{ repeatIcon }}</v-icon></v-btn
        >
        <v-btn dark icon @click="$emit('click-prev')"
          ><v-icon>mdi-skip-previous</v-icon></v-btn
        >
        <v-btn v-if="playing" dark icon
          ><v-icon x-large @click="pause">mdi-pause</v-icon>
        </v-btn>
        <v-btn v-else dark icon
          ><v-icon x-large @click="play">mdi-play</v-icon>
        </v-btn>
        <v-btn dark icon @click="$emit('click-next')"
          ><v-icon>mdi-skip-next</v-icon></v-btn
        >
        <v-btn
          dark
          icon
          :class="[shuffle ? '' : 'grey--text']"
          @click="$emit('shuffle')"
          ><v-icon>mdi-shuffle-variant</v-icon></v-btn
        >
      </v-flex>

      <v-layout xs12 align-center>
        <span class="pr-4 grey--text">{{ currentTime | playtime }}</span>
        <v-progress-linear
          :value="rangePercent"
          color="white"
          background-color="grey"
        ></v-progress-linear>
        <span class="pl-4 grey--text">
          {{ musicRef ? musicRef.duration : 0 | playtime }}
        </span>
      </v-layout>
    </v-layout>

    <v-layout class="text-right" xs4 justify-end>
      <v-btn dark color="grey" icon @click="$emit('like')">
        <v-icon>mdi-heart-outline</v-icon>
      </v-btn>
      <v-menu v-model="volumeSlider" nudge-top="40" dark left top fixed>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="grey" dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-volume-high</v-icon>
          </v-btn>
        </template>
        <v-list>
          <div class="text-center">
            {{ volume }}
          </div>
          <v-list-item>
            <v-slider
              v-model="volume"
              min="0"
              max="100"
              step="1"
              vertical
              hide-details
              @change="onChangeVolume"
            ></v-slider>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn dark color="grey" icon @click="$emit('togglePlaylist')"
        ><v-icon>mdi-playlist-play</v-icon>
      </v-btn>
    </v-layout>

    <!-- Signature sound -->
    <audio
      ref="signatureRef"
      :src="signatureSrc"
      @ended="onSignatureEnded"
    ></audio>

    <!-- Current Music -->
    <audio
      ref="musicRef"
      @ended="onMusicEnded"
      @loadeddata="onLoadedData"
      @timeupdate="onTimeupdate"
    ></audio>
  </v-layout>
</template>

<script>
import { reactive, toRefs, computed } from 'nuxt-composition-api'
import { REPEAT } from '~/data/constant'

export default {
  filters: {
    playtime(second) {
      if (!second) return '00:00'
      const MINUTE = 60

      let tempSecond = Math.floor(second)
      const tempMinute = Math.floor(second / MINUTE)
      const minuteStr = tempMinute >= 10 ? tempMinute : '0' + tempMinute

      tempSecond -= tempMinute * MINUTE
      const secondStr =
        tempSecond >= 10 ? tempSecond % MINUTE : '0' + tempSecond

      return `${minuteStr}:${secondStr}`
    },
  },
  props: {
    musicId: { type: String, default: '' },
    coverSrc: { type: String, default: '' },
    name: { type: String, default: '' },
    artist: { type: String, default: '' },
    repeat: { type: String, default: REPEAT.NONE },
    shuffle: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const state = reactive({
      musicRef: null,
      signatureRef: null,
      loading: true,
      playing: false,
      playingSignature: false,
      volumeSlider: false,
      volume: 50,
      signatureSrc: '/track.mp3',
      playingSrc: '',
      currentTime: 0,
      duration: 0,
    })

    const onMusicEnded = () => {
      state.playing = false
      emit('ended')
      emit('next')
    }

    const onSignatureEnded = () => {
      // if (state.loading) return
      state.playingSignature = false
      play()
    }

    function onLoadedData(data) {
      // state.loading = false
    }

    function playSignatrue() {
      state.signatureRef.play()
      state.playing = false
      state.playingSignature = true
    }

    function playNew() {
      playSignatrue()
      state.musicRef.src = `/api/v1/music/file/${props.musicId}`
      // state.musicRef.load()
    }

    function play() {
      if (state.playingSignature) return
      state.musicRef.play()
      state.playing = true
    }
    function pause() {
      state.playing = false
      state.musicRef.pause()
    }

    function onTimeupdate() {
      state.currentTime = state.musicRef.currentTime
      state.duration = state.musicRef.duration
    }

    function onChangeVolume(volume) {
      state.musicRef.volume = volume / 100
      state.signatureRef.volume = volume / 100
    }

    const rangePercent = computed(
      () => (state.currentTime / state.duration) * 100
    )

    const repeatIcon = computed(() =>
      props.repeat === REPEAT.NONE
        ? 'mdi-repeat-off'
        : props.repeat === REPEAT.ONE
        ? 'mdi-repeat-once'
        : 'mdi-repeat'
    )
    const repeatActive = computed(() => props.repeat !== REPEAT.NONE)

    return {
      ...toRefs(state),

      // signature
      onSignatureEnded,
      playSignatrue,
      onLoadedData,

      // player
      play,
      playNew,
      pause,
      onMusicEnded,
      onTimeupdate,
      onChangeVolume,

      // computed
      rangePercent,
      repeatIcon,
      repeatActive,
    }
  },
}
</script>

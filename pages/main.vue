<template>
  <v-container>
    <v-layout v-if="musics" row>
      <MusicCard
        v-for="music in musics"
        :key="music.id"
        class="ma-4"
        :cover-src="getCoverSrc(music)"
        :name="music.name"
        :artist="music.artist.name"
        @click-play="onClickMusic(music)"
      />
    </v-layout>
    <v-layout v-else justify-center align-content-center>
      <v-flex class="pa-12 text-center">
        등록된 음악이 없습니다.
        <br />
        <nuxt-link to="/upload">이곳</nuxt-link>에서 음악을 업로드 해주세요
      </v-flex>
    </v-layout>

    <MusicPlaylist
      v-model="playlistDrawer"
      :playlist="musicPlaylist"
      @click-music="onClickMusic"
      @save-playlist="onSavePlaylist"
    />

    <v-footer v-show="currentMusicId" style="z-index: 6;" fixed app>
      <MusicPlayer
        ref="musicPlayer"
        :music-id="currentMusicId"
        :cover-src="getCoverSrc(currentMusic)"
        :name="currentMusicName"
        :artist="currentMusicArtist"
        :repeat="playerState.repeat"
        :shuffle="playerState.shuffle"
        @togglePlaylist="playlistDrawer = !playlistDrawer"
        @ended="onEndedMusic"
        @click-prev="onClickPrevButton"
        @click-next="onClickNextButton"
        @prev="onPrevMusic"
        @next="onNextMusic"
        @repeat="onClickRepeat"
        @shuffle="onClickShuffle"
      />
    </v-footer>
  </v-container>
</template>

<script>
import {
  reactive,
  useAsync,
  toRefs,
  computed,
  watch,
} from 'nuxt-composition-api'
import MusicPlayer from '~/components/MusicPlayer'
import MusicPlaylist from '~/components/MusicPlaylist'
import MusicCard from '~/components/MusicCard'
import { REPEAT } from '~/data/constant'

const getRandomIndex = (length, prevIndex) => {
  let randomIndex

  do {
    randomIndex = Math.floor(Math.random() * length)
  } while (prevIndex === randomIndex)

  return randomIndex
}

export default {
  components: { MusicCard, MusicPlayer, MusicPlaylist },
  setup(props, { root: { $axios, $set, $nextTick } }) {
    const state = reactive({
      playlistDrawer: false,
      musics: useAsync(() => $axios.$get('/music/info')),
      currentMusic: null,
      musicPlayer: null,
      musicPlaylist: useAsync(() => $axios.$get('/music/playlist')),
    })

    const playerState = reactive({
      repeat: REPEAT.NONE,
      shuffle: false,
    })

    const currentMusicId = computed(() => state.currentMusic?.id)
    const currentMusicName = computed(() => state.currentMusic?.name)
    const currentMusicArtist = computed(() => state.currentMusic?.artist?.name)

    const _playNewMusic = (music) => {
      state.currentMusic = music
      $nextTick(() => state.musicPlayer.playNew())
    }

    const onClickMusic = (clickedMusic) => {
      // 같은곡이 플레이중일시 무효화
      if (
        clickedMusic.id === state.currentMusic?.id &&
        state.musicPlayer.playing
      )
        return

      const music = state.musicPlaylist.find(
        (music) => music.id === clickedMusic.id
      )
      // 재생목록에 존재하지 않을때 추가
      if (!music) state.musicPlaylist.push(clickedMusic)

      _playNewMusic(clickedMusic)
    }

    // repeat 버튼 클릭시 상태 변경
    const onClickRepeat = () => {
      switch (playerState.repeat) {
        case REPEAT.NONE:
          playerState.repeat = REPEAT.ONE
          break
        case REPEAT.ONE:
          playerState.repeat = REPEAT.ALL
          break
        case REPEAT.ALL:
          playerState.repeat = REPEAT.NONE
          break

        default:
          break
      }
    }

    const _playRandomMusic = (currentIndex) => {
      const nextIndex = getRandomIndex(state.musicPlaylist.length, currentIndex)
      _playNewMusic(state.musicPlaylist[nextIndex])
    }

    const onClickPrevButton = () => {
      const currentIndex = state.musicPlaylist.findIndex(
        (music) => music.id === state.currentMusic.id
      )
      if (playerState.shuffle) return _playRandomMusic(currentIndex)
      const prevMusic = state.musicPlaylist[currentIndex - 1]
      if (!prevMusic) return
      _playNewMusic(prevMusic)
    }
    const onClickNextButton = () => {
      const currentIndex = state.musicPlaylist.findIndex(
        (music) => music.id === state.currentMusic.id
      )
      if (playerState.shuffle) return _playRandomMusic(currentIndex)
      const nextMusic = state.musicPlaylist[currentIndex + 1]
      if (!nextMusic) return
      _playNewMusic(nextMusic)
    }

    const onPrevMusic = () => {
      const currentIndex = state.musicPlaylist.findIndex(
        (music) => music.id === state.currentMusic.id
      )
      if (playerState.shuffle) return _playRandomMusic(currentIndex)

      const prevMusic = state.musicPlaylist[currentIndex - 1]

      if (!prevMusic) return

      _playNewMusic(prevMusic)
    }

    const onNextMusic = () => {
      const currentIndex = state.musicPlaylist.findIndex(
        (music) => music.id === state.currentMusic.id
      )

      // 한 곡 반복이면 현재 곡 다시 재생
      if (playerState.repeat === REPEAT.ONE)
        return _playNewMusic(state.musicPlaylist[currentIndex])

      if (playerState.shuffle) return _playRandomMusic(currentIndex)

      const nextMusic =
        // 전체 반복이면 첫 곡 재생
        playerState.repeat === REPEAT.ALL &&
        !state.musicPlaylist[currentIndex + 1]
          ? state.musicPlaylist[0]
          : state.musicPlaylist[currentIndex + 1]

      if (!nextMusic) return

      _playNewMusic(nextMusic)
    }

    // shuffle 버튼 클릭시 상태 변경
    const onClickShuffle = () => {
      playerState.shuffle = !playerState.shuffle
    }

    // 음악 재생 완료시 조회수 카운트를 위한 POST 요청
    const onEndedMusic = (music) => {
      $axios.post(`/music/play/end/${state.currentMusic.id}`)
    }

    const getCoverSrc = (music) =>
      music?.files?.find((file) => file.role === 'cover')?.location

    const onSavePlaylist = (newPlaylist) => {
      state.musicPlaylist = newPlaylist
    }

    // Playlist가 변경될때마다 저장
    watch(
      () => state.musicPlaylist,
      (playlist) => {
        $axios.$post('/music/playlist', {
          playlist: playlist.map((music) => music.id),
        })
      }
    )
    return {
      ...toRefs(state),

      // playlist
      onClickMusic,
      onSavePlaylist,

      // player
      playerState,
      onClickRepeat,
      onClickPrevButton,
      onClickNextButton,
      onPrevMusic,
      onNextMusic,
      onClickShuffle,
      onEndedMusic,

      getCoverSrc,

      // computed
      currentMusicId,
      currentMusicName,
      currentMusicArtist,
    }
  },
}
</script>

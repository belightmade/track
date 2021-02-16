<template>
  <v-layout justify-center align-center fill-height>
    <v-flex xs12 sm10 md8>
      <v-card tile>
        <v-card-title>
          <v-file-input
            v-model="musicFile"
            placeholder="업로드할 곡을 선택해주세요(wav파일만 가능합니다)"
            prepend-icon="mdi-music"
            accept=".wav"
            :suffix="uploadStatus"
            show-size
            dense
            hide-details
            solo
            flat
            @change="onChangeMusicFile"
          />
        </v-card-title>

        <v-progress-linear
          :value="musicFile ? uploadPercent : 0"
          height="8"
          color="black"
          background-color="deep-orange"
        ></v-progress-linear>

        <v-card-text class="pa-8" style="min-height: 100%;">
          <v-tabs v-model="tab">
            <v-tabs-slider></v-tabs-slider>

            <v-tab href="#tab-song">곡 정보</v-tab>
            <v-tab href="#tab-detail">세부정보</v-tab>

            <!-- 곡 정보 -->
            <v-tab-item class="pt-4" value="tab-song">
              <v-layout row fill-height>
                <v-flex class="pr-4" xs4>
                  <v-file-input
                    v-model="coverImage"
                    accept="image/jpeg,image/jpg,image/png"
                    label="커버 이미지"
                    dense
                    outlined
                    @change="onChangeCoverImage"
                  >
                  </v-file-input>
                  <v-img
                    :src="coverImagePreview"
                    width="100%"
                    class="black"
                  ></v-img>
                </v-flex>
                <v-flex xs8>
                  <v-text-field
                    v-model="name"
                    label="곡이름"
                    dense
                    outlined
                  ></v-text-field>
                  <v-autocomplete
                    v-model="genreId"
                    :items="genreItems"
                    label="장르"
                    dense
                    outlined
                  ></v-autocomplete>
                  <v-text-field
                    v-model="tag"
                    label="태그"
                    dense
                    outlined
                  ></v-text-field>
                  <v-textarea
                    v-model="description"
                    label="설명"
                    placeholder="Describe your track"
                    rows="4"
                    outlined
                  />
                </v-flex>
                <v-flex class="text-right">
                  <v-btn dark @click="tab = 'tab-detail'">다음</v-btn>
                </v-flex>
              </v-layout>
            </v-tab-item>

            <!-- 세부정보 -->
            <v-tab-item class="pt-4" value="tab-detail">
              <v-layout row>
                <v-flex class="pa-4" xs4>
                  <v-select
                    v-model="multitask"
                    :items="multitaskItems"
                    label="다중작업"
                    dense
                    outlined
                    hide-details
                    @change="artistId = null"
                  ></v-select>
                </v-flex>
                <v-flex class="pa-4" xs4>
                  <v-autocomplete
                    v-model="artistId"
                    :items="artistItems"
                    label="아티스트"
                    dense
                    outlined
                    hide-details
                  ></v-autocomplete>
                </v-flex>
                <v-flex class="pa-4" xs4>
                  <v-text-field
                    v-model="songwriter"
                    label="작곡가"
                    dense
                    outlined
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex class="pa-4" xs4>
                  <v-text-field
                    v-model="lyricist"
                    label="작사가"
                    dense
                    outlined
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex class="pa-4" xs4>
                  <v-text-field
                    v-model="arranger"
                    label="편곡가"
                    dense
                    outlined
                    hide-details
                  ></v-text-field>
                </v-flex>
                <v-flex class="pa-4" xs4>
                  <v-text-field
                    v-model="original"
                    label="원곡자"
                    dense
                    outlined
                    hide-details
                  ></v-text-field>
                </v-flex>

                <v-flex class="py-4" xs12></v-flex>

                <v-flex class="pa-4" xs8>
                  <v-textarea
                    v-model="lyrics"
                    label="가사"
                    rows="8"
                    dense
                    outlined
                    hide-details
                  ></v-textarea>
                </v-flex>
                <v-flex class="pa-4" xs4>
                  <v-menu
                    v-model="datePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="releaseDate"
                        label="릴리즈 날짜"
                        prepend-icon="mdi-calendar"
                        readonly
                        dense
                        outlined
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="releaseDate"
                      @input="datePicker = false"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex class="text-right" xs12>
                  <v-btn text @click="tab = 'tab-song'">cancel</v-btn>
                  <v-btn
                    color="deep-orange"
                    :disabled="!canSubmit"
                    :dark="canSubmit"
                    @click="submit"
                    >save</v-btn
                  >
                </v-flex>
              </v-layout>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import {
  defineComponent,
  reactive,
  computed,
  useAsync,
  toRefs,
  watch,
} from 'nuxt-composition-api'

export default defineComponent({
  setup(props, { root: { $axios, $router } }) {
    const state = reactive({
      musicFile: null,
      musicUploading: true,
      coverUploading: false,
      uploadPercent: 0,
      wavId: null,
      mp3Id: null,
      coverId: null,
      tab: 'tab-song',

      // 곡정보
      genreList: useAsync(() => $axios.$get('/genre')),
      artistList: useAsync(() => $axios.$get('/artist')),
      coverImage: null,
      coverImagePreview: null,
      name: '',
      genreId: '',
      tag: '',
      description: '',
      multitask: true,

      // 세부정보
      artistId: '',
      songwriter: '',
      lyricist: '',
      arranger: '',
      original: '',
      lyrics: '',
      releaseDate: '',
      datePicker: false,
    })

    const genreItems = computed(() =>
      state.genreList?.map((genre) => ({
        text: genre.name,
        value: genre.id,
      }))
    )
    const artistItems = computed(() =>
      state.artistList?.map((artist) => ({
        text: `${artist.id} - ${artist.name}`,
        value: artist.id,
      }))
    )

    const multitaskItems = [
      { text: 'Yes', value: true },
      { text: 'No', value: false },
    ]

    watch(
      () => state.musicFile,
      (newVal) => {
        if (newVal) return

        state.wavId = null
        state.mp3Id = null
      }
    )

    const uploadStatus = computed(() =>
      state.musicFile
        ? state.uploadPercent === 100
          ? state.musicUploading
            ? 'MP3 변환중'
            : '업로드 완료'
          : '업로드중'
        : ''
    )

    const onChangeCoverImage = async () => {
      if (!state.coverImage) {
        state.coverImagePreview = null
        return
      }
      // 미리보기 이미지 만들기
      const reader = new FileReader()
      reader.onload = (e) => {
        state.coverImagePreview = e.target.result
      }
      reader.readAsDataURL(state.coverImage)

      state.coverUploading = true

      const formData = new FormData()
      formData.append('cover', state.coverImage)

      const { coverId } = await $axios.$post('/music/file/cover', formData)
      state.coverId = coverId
      state.coverUploading = false
    }

    const onChangeMusicFile = async () => {
      if (!state.musicFile) return
      state.musicUploading = true

      const formData = new FormData()
      formData.append('file', state.musicFile)

      const { wavId, mp3Id } = await $axios.$post('/music/file', formData, {
        onUploadProgress(progressEvent) {
          state.uploadPercent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        },
      })
      state.wavId = wavId
      state.mp3Id = mp3Id
      state.musicUploading = false
    }

    const canSubmit = computed(
      () =>
        state.musicFile &&
        state.coverImage &&
        !state.musicUploading &&
        !state.coverUploading
    )

    const submit = () => {
      if (!canSubmit) return

      return $axios
        .post('/music/info', {
          name: state.name,
          genreId: state.genreId,
          tag: state.tag,
          description: state.description,
          multitask: state.multitask,
          artistId: state.artistId,
          songwriter: state.songwriter,
          lyricist: state.lyricist,
          arranger: state.arranger,
          original: state.original,
          lyrics: state.lyrics,
          releaseDate: state.releaseDate,
          wavId: state.wavId,
          mp3Id: state.mp3Id,
          coverId: state.coverId,
        })
        .then(() => $router.push('/main'))
    }

    return {
      ...toRefs(state),

      multitaskItems,
      onChangeCoverImage,
      onChangeMusicFile,
      submit,

      // computed
      uploadStatus,
      genreItems,
      artistItems,
      canSubmit,
    }
  },
})
</script>

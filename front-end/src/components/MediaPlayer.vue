<template>
    <div>
        <div v-show="currentType === 'video'"
                @click="hide">
            Hide
        </div>
        <div v-show="currentType === 'video'">
            Now Playing:
        </div>

        <video-player
                v-show="showPlayer"
                class="video-player-box"
                ref="videoPlayer"
                :options="playerOptions"
                :playsinline="false"
                :controls="true"
        >
        </video-player>
    </div>
</template>

<script>
  import {EventBus} from '../bus/EventBus'

  export default {
    name: "media-player",
    props: ['src'],
    data() {
      return {
        showPlayer: true,
        currentType: '',
        currentHeight: 40,
        playerOptions: {
          // videojs options
          muted: false,
          autoplay: true,
          fluid: false,
          controls: true,
          height: 50,
          width: screen.width,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: []
        }
      }
    },
    computed: {
      windowWidth() {
        return screen.width
      },
    },
    mounted() {
      EventBus.$on('play-video', fileInfo => {

        switch (fileInfo.ext) {
          case 'mp3':
            this.playerOptions.height = 40
            this.currentHeight = 40
            this.currentType = 'audio'
            break
          default:
            this.playerOptions.height = screen.height / 3
            this.currentHeight = screen.height / 3
            this.currentType = 'video'
            this.showPlayer = true
        }
        let srcUrl = `http://192.168.0.10:9001/player/${fileInfo.filePath}`
        this.playerOptions.sources = []
        this.playerOptions.sources.push({
          type: 'video/mp4',
          src: srcUrl
        })
      })
    },
    methods: {
      hide() {
        this.showPlayer = !this.showPlayer
      }
    },
    watch: {}
  }
</script>

<style scoped>

</style>
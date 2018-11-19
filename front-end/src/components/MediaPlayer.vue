<template>
    <div>
        <v-layout row align-center>
            <v-flex xs2>

            </v-flex>
            <v-flex xs8 class="text-xs-center">
                <div v-show="currentType === 'video'">
                    {{ fileTitle }}
                     - {{ playerEvent }}
                </div>
            </v-flex>
            <v-flex xs2>
                <div v-show="currentType === 'video'"
                     @click="hide">
                    <v-icon v-show="showPlayer">arrow_downward</v-icon>
                    <v-icon v-show="!showPlayer">arrow_upward</v-icon>
                </div>

            </v-flex>
        </v-layout>

        <video-player
                v-show="showPlayer"
                class="video-player-box"
                ref="videoPlayer"
                :options="playerOptions"
                :playsinline="false"
                :controls="true"
                @timeupdate="updateTime"
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
        currentFile:'',
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
        },
        playerEvent: null
      }
    },
    computed: {
      windowWidth() {
        return screen.width
      },
      fileTitle() {
        return this.currentFile.name.split('.').slice(0, -1).join('.')
      }
    },
    mounted() {
      EventBus.$on('play-video', fileInfo => {

        this.currentFile = fileInfo

        switch (fileInfo.ext) {
          case 'mp3':
            this.playerOptions.height = 40
            this.currentHeight = 40
            this.currentType = 'video'
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
      },
      updateTime(event){
        console.log('Time update', event)
         this.playerEvent = event.controlBar.currentTimeDisplay.formattedTime_
      }
    },
    watch: {}
  }
</script>

<style scoped>

</style>
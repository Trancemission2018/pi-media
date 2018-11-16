<template>

    <video-player  class="video-player-box"
                   ref="videoPlayer"
                   :options="playerOptions"
                   :playsinline="false"
                   :controls="true"

                   customEventName="customstatechangedeventname"
                   >

    </video-player>
    
</template>

<script>
  export default {
    name: "media-player",
    data() {
      return {
        playerOptions: {
          // videojs options
          muted: false,
          autoplay: true,
          fluid:true,
          controls:true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            src: `http://10.0.0.165:9001/player/${this.$route.params.filePath}`
          }],
        }
      }
    },
    computed: {
      src() {
        return `http://10.0.0.165:9001/player/${this.$route.params.filePath}`
      }
    }
  }
</script>

<style scoped>

</style>
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
          muted: true,
          fluid:true,
          controls:true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            src: "http://192.168.0.10:9001/player"
          }],
          poster: "/static/images/author.jpg",
        }
      }
    }
  }
</script>

<style scoped>

</style>
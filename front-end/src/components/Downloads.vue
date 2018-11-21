<template>

    <v-container>
        <div v-if="piStatus===0">
            Updating....
        </div>
        <div v-else-if="piStatus===1">
            <div v-if="torrents.length===0">
                No torrents found
            </div>
            <v-list
                    v-else
                    two-line>

                <v-list-tile
                        v-for="(torrent, id) in torrents"
                        :key="id"
                        @click=""
                >
                    <v-list-tile-content>
                        <v-list-tile-title v-html="torrent.name"></v-list-tile-title>
                        <v-list-tile-sub-title>{{ Math.round(torrent.percentDone * 100,2)}}%</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>

            </v-list>

        </div>
        <div v-else-if="piStatus===2">
            Error getting downloads - Try restarting the Pi
        </div>

        <v-snackbar
                v-model="showStatus"
                bottom
                color="red"
                :timeout="5000"
        >
            {{ status }}
        </v-snackbar>
    </v-container>

</template>

<script>

  export default {
    name: "down",
    components: {},
    props: [],
    data() {
      return {
        torrents: [],
        showStatus: false,
        piStatus: 0,
        status: ''
      }
    },
    created() {
      this.loadTorrentStatus()
    },
    methods: {
      loadTorrentStatus() {
        this.$piApi.get('/downloads/status').then(response => {
          this.torrents = response.data.torrents
          this.piStatus = 1
          console.log('Status response', response)
        }).catch(error => {
          this.status = 'Error getting downloads - Try restarting the Pi'
          this.showStatus = true
          this.piStatus = 2
          console.error(error)
        })
      }
    }
  }
</script>

<style scoped>

</style>
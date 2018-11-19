<template>

    <v-container>

        <v-layout row align-center>
                <v-flex xs6 text-xs-left class="pa-2">
            </v-flex>
            <v-flex xs6 text-xs-right class="pa-2">
                <v-icon
                        @click="addPlayList()"
                >add</v-icon>
            </v-flex>
        </v-layout>

        <v-list>
            <v-list-tile
                    v-for="(playList, id) in playLists"
                    :key="id"
                    @click="selectPlaylist(playList)"
            >

                <v-list-tile-content>
                    <v-list-tile-title v-html="playList.text">
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-container>

</template>

<script>
  export default {
    name: "playlists",
    components: {},
    props: [],
    data() {
      return {
         playLists: []
      }
    },
    created() {
      this.getPlaylists()
    },
    methods: {
      getPlaylists() {
        this.$piApi.get('/playlists').then(response => {
          this.playLists = response.data
        }).catch(error => {
          console.error(error)
        })
      },
      addPlayList() {
        let playListName = prompt('Playlist Name')
        if (playListName) {
          this.$piApi.post('/playlist', {playListName}).then(response => {
            console.log('Playlist created', response)
            this.getPlaylists()
          }).catch(error => console.error(error))
        }
      },
      selectPlaylist(playList){
        console.log(playList)
        this.$router.push(`/playlist/${playList.value}`)
      },
      selectFile(file) {

      }
    }
  }
</script>

<style scoped>

</style>
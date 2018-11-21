<template>

    <v-container>

        <v-layout row align-center>
            <v-flex xs1 text-xs-left class="pa-2">
                <v-icon
                        @click="$router.go(-1)"
                >arrow_back</v-icon>
            </v-flex>
            <v-flex xs8 text-xs-left class="pa-2">
                {{ playList.name }}
            </v-flex>

            <v-flex xs3 text-xs-right class="pa-2">

                <v-icon
                        @click="playPlayList(playList)"
                        class="mr-2"
                >play_arrow</v-icon>
                <v-icon
                        @click="deletePlayList()"
                >delete</v-icon>
            </v-flex>
        </v-layout>
        <v-list>
            <v-list-tile
                    v-for="(file, id) in playList.files"
                    :key="id"
                    @click="selectFile(file)"
            >

                <v-list-tile-content>
                    <v-list-tile-title v-html="file.title">
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-container>

</template>

<script>

  import {EventBus} from '../bus/EventBus'

  export default {
    name: "playlist",
    components: {},
    props: [],
    data() {
      return {
         playList: {
           name: '',
           files: []
         }
      }
    },
    created() {
      this.loadPlayList()
    },
    methods: {
      loadPlayList() {
        this.$piApi.get(`/playlist/${this.$store.state.mplayer.playlist.id}`).then(response => {
          this.playList = response.data
        }).catch(error => {
          console.error(error)
        })
      },
      selectFile(file) {
        // Show modal with file options, remove, move up, move down

      },
      playPlayList(playlist) {
        console.log('Playlist', playlist)
        this.$store.dispatch('playPlayList', playlist).then(() => {
          EventBus.$emit('play-playlist')
        })
      }
    }
  }
</script>

<style scoped>

</style>
<template>

    <v-container>

        <v-layout v-if="!preparingDownload"
                row wrap text-xs-center align-center>
            <v-flex xs8>

                <v-text-field
                        label="Search"
                        placeholder="Paddington"
                        v-model="query"
                ></v-text-field>
            </v-flex>
            <v-flex xs4>

                <v-btn @click="search">Search</v-btn>

            </v-flex>
        </v-layout>

        <div v-if="searching">
            <v-progress-circular
                    indeterminate
                    color="purple"
            ></v-progress-circular>
        </div>
        <div v-else-if="preparingDownload">
            <folder-select
                    :torrent="this.currentTorrent"
                    @startDownload="download()"
                    @cancel="preparingDownload = false"
            ></folder-select>
        </div>
        <div v-else>

            <v-list v-for="(result, id) in searchResults"
                    :key="id"
                    two-line
            >
                <v-list-tile
                        @click="prepareDownload(result)"

                >

                    <v-list-tile-content>
                        <v-list-tile-title v-html="">{{result.name}}</v-list-tile-title>
                        <v-list-tile-sub-title
                                v-html="`${result.meta}<br />${result.seeds} / ${result.leechers}`"></v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </div>


        <v-snackbar
                v-model="showStatus"
                bottom
                :timeout="5000"
        >
            {{ status }}
        </v-snackbar>

    </v-container>

</template>

<script>

  import axios from 'axios'
  import FolderSelect from "./FolderSelect"

  // const apiBase = 'http://192.168.0.10:9001'
  const apiBase = 'http://10.0.0.165:9001'

  const piApi = axios.create({
    baseURL: apiBase
  })

  export default {
    name: "download",
    components: {FolderSelect},
    props: [],
    data() {
      return {
        preparingDownload: false,
        query: '',
        searchResults: [],
        status: '',
        showStatus: false,
        searching: false,
        currentTorrent: null
      }
    },
    created() {

    },
    methods: {
      search() {
        if (this.query === '') {
          alert('Please enter a search term')

        } else {
          this.searching = true
          piApi.post('/downloads/search', {query: this.query}).then(response => {
            this.searchResults = response.data.results
            if (this.searchResults === 0) {


            } else {

            }
          }).catch(error => {
            console.error(error)
          }).finally(() => this.searching = false)
        }
      },

      prepareDownload(result) {
        this.preparingDownload = true
        this.currentTorrent = result
      },
      download(folder) {
        piApi.post('/downloads/download', this.currentTorrent).then(response => {
          this.status = 'Download added...'
          this.showStatus = true
        }).catch(error => {
          this.status = 'Error adding download - Try restarting the Pi'
          this.showStatus = true
          console.error(error)
        })
      },
    }
  }
</script>

<style scoped>

</style>
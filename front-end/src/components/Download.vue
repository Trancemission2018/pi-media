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

        <div v-if="searching" text-xs-center>
            <v-layout row align-centre text-xs-center>
                <v-flex xs12>
                    <div> Searching...</div>

                    <v-progress-circular
                            indeterminate
                            color="purple"
                    ></v-progress-circular>
                </v-flex>
            </v-layout>
        </div>
        <div v-else-if="preparingDownload">
            <folder-select
                    :torrent="this.currentTorrent"
                    @startDownload="download"
                    @cancel="preparingDownload = false"
            ></folder-select>
        </div>
        <div v-else-if="noResults">
            Tumbleweed
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
                :color="statusColour"
        >
            {{ status }}
        </v-snackbar>

    </v-container>

</template>

<script>

  import FolderSelect from "./FolderSelect"

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
        currentTorrent: null,
        statusColour: '',
        noResults: false
      }
    },
    created() {

    },
    methods: {
      search() {
        if (this.query === '') {
          alert('Please enter a search term')

        } else {
          this.noResults = false
          this.searching = true
          this.$piApi.post('/downloads/search', {query: this.query}).then(response => {
            console.log('Here are the results', response.data)
            this.searchResults = response.data.results
            if (this.searchResults === 0) {
              this.noResults = true
            } else {
              this.noResults = false
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
        console.log('Download to folder', folder)
        this.statusColour = 'green'
        this.$piApi.post('/downloads/download', {...this.currentTorrent, folder: folder}).then(response => {
          this.status = 'Download added...'
          this.showStatus = true
          this.preparingDownload = false
        }).catch(error => {
          this.statusColour = 'red'
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
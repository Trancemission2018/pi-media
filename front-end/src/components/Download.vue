<template>

    <v-container>

        <v-layout row wrap text-xs-center align-center>
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
        <div v-else>

            <v-list v-for="(result, id) in searchResults"
                    :key="id">
                <v-list-tile
                        @click="download(result)"

                >

                    <v-list-tile-content>
                        <v-list-tile-title v-html="">{{result.name}}</v-list-tile-title>
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

  // const apiBase = 'http://192.168.0.10:9001'
  const apiBase = 'http://10.0.0.165:9001'

  const piApi = axios.create({
    baseURL: apiBase
  })

  export default {
    name: "download",
    components: {},
    props: [],
    data() {
      return {
        query: '',
        searchResults: [],
        status: '',
        showStatus: false,
        searching: false
      }
    },
    created() {

    },
    methods: {
      search() {
        this.searching = true
        piApi.post('/downloads/search', {query: this.query}).then(response => {
          console.log('Search results', response.data)
          this.searchResults = response.data.results
        }).catch(error => {
          console.error(error)
        }).finally(() => this.searching = false)
      },
      download(result) {
        piApi.post('/downloads/download', result).then(response => {
          this.status = 'Download added...'
          this.showStatus = true
          console.log('Download response:', response)
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
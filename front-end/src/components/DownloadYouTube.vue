<template>

    <v-container>


        <div v-if="!preparingDownload">
            <v-layout row wrap text-xs-center align-center>
                <v-flex xs8>

                    <v-text-field
                            label="YouTube Download"
                            placeholder="https://www.youtube.com/watch?v=RY_2gElt3SA"
                            v-model="youtubeURL"
                    ></v-text-field>
                </v-flex>
                <v-flex xs4>

                    <v-btn @click="downloadYouTube">Download</v-btn>

                </v-flex>
            </v-layout>
        </div>

        <div v-if="preparingDownload === true">
            <folder-select-youtube
                    :url="youtubeURL"
                    :title="title"
                    @startDownload="startDownload"
                    @cancel="preparingDownload = false"
            ></folder-select-youtube>
        </div>

            <div v-else-if="searching">
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
  import FolderSelectYoutube from "./FolderSelectYouTube"

  // const apiBase = 'http://192.168.0.10:9001'
  const apiBase = 'http://10.0.0.165:9001'

  const piApi = axios.create({
    baseURL: apiBase
  })

  export default {
    name: "download",
    components: {FolderSelectYoutube},
    props: [],
    data() {
      return {
        youtubeURL: 'https://www.youtube.com/watch?v=k0kswK2aI08',
        title: '',
        status: '',
        showStatus: false,
        searching: false,
        preparingDownload: false
      }
    },
    created() {

    },
    methods: {
      startDownload(folder) {
        console.log('Starting download')
        console.log('We would like to download', this.youtubeURL)
        console.log('We should have a folder', folder)
        piApi.post('/downloads/youtube', {url: this.youtubeURL, folder}).then(response => {
          this.status = 'Download added...'
          this.showStatus = true
          console.log('Download response:', response)
        }).catch(error => {
          this.status = 'Error adding download - Try restarting the Pi'
          this.showStatus = true
          console.error(error)
        }).finally(() => this.preparingDownload = false)

      },
      downloadYouTube() {
        if (this.youtubeURL === '') {
          alert('Please enter a URL or ID')
        } else {
          this.searching=true
          piApi.post('/downloads/youtube/title', {url: this.youtubeURL}).then((response) => {
            this.title = response.data.title
            this.preparingDownload = true
          }).catch(error => {
            console.error(error)
          }).finally(() => this.searching = false)
        }
      }
    }
  }
</script>

<style scoped>

</style>
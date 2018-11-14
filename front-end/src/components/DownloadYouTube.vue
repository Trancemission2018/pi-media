<template>

    <v-container>



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
        youtubeURL: '',
        status: '',
        showStatus: false,
        searching: false
      }
    },
    created() {

    },
    methods: {
      downloadYouTube() {
        piApi.post('/downloads/youtube', {url: this.youtubeURL}).then(response => {
          this.status = 'Download added...'
          this.showStatus = true
          console.log('Download response:', response)
        }).catch(error => {
          this.status = 'Error adding download - Try restarting the Pi'
          this.showStatus = true
          console.error(error)
        })

      }
    }
  }
</script>

<style scoped>

</style>